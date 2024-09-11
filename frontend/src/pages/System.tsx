import Validator from '../modules/Validator';
import Transaction from '../modules/Transaction';
import InclusionTime from '../modules/InclusionTime';
import ResponsiveLayout from "../components/ResponsiveLayout";
import Keyper from "../modules/Keyper";

const System = () => {
    return (
        <ResponsiveLayout>
                <Validator />
                <Keyper />
                <Transaction />
                <InclusionTime />
        </ResponsiveLayout>
    );
};

export default System;
