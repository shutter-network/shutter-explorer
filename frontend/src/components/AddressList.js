import InfoBox from "../components/InfoBox";

const AddressList = ({ title, tooltip, addresses }) => {
    return (
        <InfoBox
            title={title}
            tooltip={tooltip}
            value={(
                <ul style={{listStyleType: "none", padding: 0}}>
                    {addresses.map((address, index) => (
                        <li key={index}>
                            <a href={`https://etherscan.io/address/${address}`} target="_blank"
                               rel="noopener noreferrer">{address}</a>
                        </li>
                    ))}
                </ul>
            )}
        />
    )
};

export default AddressList;