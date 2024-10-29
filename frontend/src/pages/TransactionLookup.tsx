import { FC } from "react"
import ResponsiveLayout from "../components/ResponsiveLayout"
import {Typography} from "@mui/material";
import TitleSection from "../components/TitleSection";

const TransactionLookup: FC = () => {
    return (
        <ResponsiveLayout>
            <>
                <TitleSection title="Transaction Lookup" />

                <Typography variant="body1" textAlign="left" paddingTop="20px" lineHeight="180%" fontSize={"18px"}>
                    <h2> How to Use the Transaction Lookup on Shutter Explorer </h2>
                    When you send a transaction using Shutter, it remains encrypted and won’t show up on Gnosisscan until it’s processed.
                    To help you track your transaction status while it’s still shielded, we created the Transaction Lookup tool on Shutter Explorer.

                    <h3>Steps to Use the Transaction Lookup</h3>

                    <ul>
                        <li>
                            <b>Copy the Transaction Hash:</b> After submitting your transaction (e.g., via MetaMask), copy your
                            transaction hash (Tx ID).
                        </li>
                        <li>
                            <b>Paste in Shutter Explorer:</b> Go to the search bar above and paste your transaction hash into the input field.
                        </li>
                        <li>
                            <b>View the Status:</b> The tool will show one of the following statuses:
                            <ul>
                                <li> Submitted: Your transaction was submitted to the sequencer.</li>
                                <li> Pending User Transaction: Your transaction has been decrypted but has not been included yet.</li>
                                <li> Shielded Inclusion: Your transaction has been decrypted and included by the sequencer is now visible on Gnosisscan.</li>
                                <li> Unshielded Inclusion: Your transaction was resent by the inclusion service, temporarily unshielded, before being fully included.</li>
                                <li> Invalid: Your transaction is invalid.</li>
                                <li> Cannot be decrypted: Your transaction cannot be decrypted.</li>
                                <li> Inclusion Timeout Expired: We waited for your transaction receipt for a certain time (1 hour), and we didn't receive it. Your transaction could still included after the timeout expired. Please check on the corresponding explorer. </li>
                            </ul>
                        </li>

                    </ul>

                    This tool lets you monitor your transaction before and after it becomes visible on Gnosisscan.
                </Typography>

            </>
        </ResponsiveLayout>
    )
}

export default TransactionLookup;
