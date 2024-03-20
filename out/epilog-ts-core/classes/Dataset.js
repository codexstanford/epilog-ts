import { Atom, ERROR_ATOM } from "./Atom.js";
class Dataset {
    constructor(factList) {
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
                nonGroundStr += nonGroundAtom.toString() + " ";
            }
            nonGroundStr = nonGroundStr.slice(0, -1);
            nonGroundStr += "]";
            console.error("Datasets must only contain ground atoms, but non-ground atoms provided:", nonGroundStr);
            this.factList = [ERROR_ATOM];
            return;
        }
        this.factList = factList;
    }
    getPredNames() {
        let predNameList = [];
        for (let fact of this.factList) {
            predNameList = [...predNameList, ...fact.getPredNames()];
        }
        return new Set(predNameList);
    }
    toString() {
        let str = "[";
        for (let fact of this.factList) {
            str += fact.toString() + " ";
        }
        str = str.slice(0, -1);
        str += "]";
        return str;
    }
    toEpilogString() {
        // Currently mostly a duplicate of toString, but duplicating code to decouple the two
        let str = "";
        for (let fact of this.factList) {
            str += fact.toString() + " ";
        }
        str = str.slice(0, -1);
        return str;
    }
    static renamePredicate(oldPredName, newPredName, dataset) {
        let renamedFacts = [];
        for (let fact of dataset.factList) {
            renamedFacts.push(Atom.renamePredicate(oldPredName, newPredName, fact));
        }
        return new Dataset(renamedFacts);
    }
}
export { Dataset };
//# sourceMappingURL=Dataset.js.map