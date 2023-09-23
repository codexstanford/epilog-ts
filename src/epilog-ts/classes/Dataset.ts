import { Atom, ERROR_ATOM } from "./Atom.js"
import { Predicate } from "./Predicate.js";

class Dataset {
    // Note: doesn't check for duplicates, since JS doesn't allow overriding the comparator used by Set
    readonly factList: Atom[];

    constructor(factList: Atom[]) {
        // A dataset must only contain ground atoms
        let nonGroundAtoms = [];

        for (let fact of factList) {
            if (!fact.isGround()) {
                nonGroundAtoms.push(fact);
            }
        }

        if (nonGroundAtoms.length > 0) {
            let nonGroundStr = "[";

            for (let nonGroundAtom of nonGroundAtoms) {
                nonGroundStr += nonGroundAtom.toString() + " "
            }

            nonGroundStr = nonGroundStr.slice(0, -1);
            nonGroundStr += "]";

            console.error("Datasets must only contain ground atoms, but non-ground atoms provided:", nonGroundStr);
            this.factList = [ERROR_ATOM];
            return;
        }

        this.factList = factList;
    }

    toString() : string {
        let str = "[";

        for (let fact of this.factList) {
            str += fact.toString() + " ";
        }

        str = str.slice(0, -1);
        str += "]";

        return str;
    }

    toEpilogString() : string {
        // Currently mostly a duplicate of toString, but duplicating code to decouple the two
        let str = "";

        for (let fact of this.factList) {
            str += fact.toString() + " ";
        }

        str = str.slice(0, -1);

        return str;
    }

    static renamePredicate(oldPredName: string, newPredName: string, dataset: Dataset) : Dataset {
        let renamedFacts : Atom[] = [];

        for (let fact of dataset.factList) {
            renamedFacts.push(Atom.renamePredicate(oldPredName, newPredName, fact));
        }


        return new Dataset(renamedFacts);
    }
}


export { Dataset }