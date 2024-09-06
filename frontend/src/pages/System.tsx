import Validator from '../modules/Validator';
import KeyperSet from '../modules/KeyperSet';
import Transaction from '../modules/Transaction';
import InclusionTime from '../modules/InclusionTime';
import ResponsiveLayout from "../layouts/ResponsiveLayout";
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
