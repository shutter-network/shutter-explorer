import {MountOptions, MountReturn} from "cypress/react";
import {ReactNode} from "react";

declare global {
    namespace Cypress {
        interface Chainable {
            mount(component: ReactNode, options?: MountOptions): Chainable<MountReturn>;
        }
    }
}
