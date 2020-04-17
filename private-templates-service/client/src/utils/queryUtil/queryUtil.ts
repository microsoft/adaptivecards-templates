import { SortType } from "../../store/sort/types";
import { FilterEnum } from "../../store/filter/types";

export function buildAdressBarURL(basePath: string, tags?: string[], ifOwned?: boolean, name?: string, sortType: SortType = "alphabetical", filterState?: FilterEnum) {
        let url: string = basePath + "/results?";
        let prepend: string = '';
        if(filterState) {
            url = `${url}${prepend}state=${filterState}`;
            prepend = '&'
        }

        url = `${url}${prepend}isClient=true`;
        prepend = '&'
        
        if(name) {
            url = `${url}${prepend}name=${name}`;
            prepend = '&'
        }
        if(ifOwned) {
            url = `${url}${prepend}owned=${ifOwned}`;
            prepend = '&'
        }
        url = `${url}${prepend}sortBy=${sortType}`;
        prepend = '&';

        if(tags) {
           for(let tag of tags) {
                url = `${url}${prepend}tags=${tag}`
           }
        }
        return url;
}
