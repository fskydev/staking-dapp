import Link from "next/link";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address, Balance } from "~~/components/scaffold-eth";
import { displayTxResult } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const contractName = "Staker";
  const externalContractName = "ExampleExternalContract";
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const { data: deployedExternalContractData, isLoading: deployedExternalContractLoading } =
    useDeployedContractInfo(externalContractName);

  const { data: rewardRatePerSecond } = useScaffoldContractRead({
    contractName: contractName,
    functionName: "rewardRatePerSecond",
  });

  const { data: claimPeriodLeft } = useScaffoldContractRead({
    contractName: contractName,
    functionName: "claimPeriodLeft",
  });

  const { data: withdrawalTimeLeft } = useScaffoldContractRead({
    contractName: contractName,
    functionName: "withdrawalTimeLeft",
  });

  const { writeAsync: txStake, isLoading: isStakeProcessingLoading } = useScaffoldContractWrite({
    contractName: contractName,
    functionName: "stake",
    value: "0.5",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: txExecute, isLoading: isExecuteProcessingLoading } = useScaffoldContractWrite({
    contractName: contractName,
    functionName: "execute",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: txWithdraw, isLoading: isWithdrawalProcessingLoading } = useScaffoldContractWrite({
    contractName: contractName,
    functionName: "withdraw",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  if (
    !deployedContractData ||
    deployedContractLoading ||
    !deployedExternalContractData ||
    deployedExternalContractLoading
  ) {
    return (
      <p className="text-3xl mt-14">
        {/* {`No contract found by the name of "${contractName}" on chain "${configuredNetwork.name}"!`} */}
        {`No contract found by the name of "${contractName}" on chain localhost!`}
      </p>
    );
  }

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 divide-y divide-slate-300 text-center">
          <div className="py-6">
            <div className="flex flex-col gap-1">
              <span className="font-medium break-words">{contractName} Contract:</span>
              <Address address={deployedContractData.address} size="3xl" />
            </div>
          </div>
          <div className="py-6">
            <div className="flex flex-col gap-1">
              <span className="font-medium break-words">APY per Block:</span>
              <div className="px-4 text-3xl">{displayTxResult(rewardRatePerSecond, true)}</div>
            </div>
          </div>

          <div>
            <div className="py-6">
              <div className="flex flex-col gap-1">
                <span className="font-medium break-words">Claim Period Left:</span>
                <span>
                  {displayTxResult(claimPeriodLeft)}
                  <span className="text-[0.8em] font-bold"> seconds</span>
                </span>
              </div>
            </div>
            <div className="py-6">
              <div className="flex flex-col gap-1">
                <span className="font-medium break-words">Withdrawal Period Left:</span>
                <span>
                  {displayTxResult(withdrawalTimeLeft)}
                  <span className="text-[0.8em] font-bold"> seconds</span>
                </span>
              </div>
            </div>
          </div>
          <div className="pt-6 pb-10">
            <div className="flex flex-col gap-6">
              <span className="font-medium break-words">Total Available ETH in Contract:</span>
              <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem] text-3xl" />
            </div>
          </div>
          <div className="pt-6 pb-10">
            <div className="flex flex-col gap-6">
              <span className="font-medium break-words">ETH Locked</span>
              <Balance
                address={deployedExternalContractData.address}
                className="px-0 h-1.5 min-h-[0.375rem] text-3xl"
              />
            </div>
          </div>
          <div className="py-6 gap-10">
            <div className="flex flex-col gap-6">
              <button
                className="btn btn-secondary rounded-sm"
                onClick={() => txExecute()}
                disabled={isExecuteProcessingLoading}
              >
                {isExecuteProcessingLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>📡 Execute!</>
                )}
              </button>
              <button
                className="btn btn-secondary rounded-sm"
                onClick={() => txWithdraw()}
                disabled={isWithdrawalProcessingLoading}
              >
                {isWithdrawalProcessingLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>🏧 Withdraw</>
                )}
              </button>
              <button
                className="btn btn-secondary rounded-sm"
                onClick={() => txStake()}
                disabled={isStakeProcessingLoading}
              >
                {isStakeProcessingLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>🥩 Stake 0.5 ether!</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
