import {render} from "@testing-library/react";
import {APIContext} from "../api";
import React from "react";
import {api} from "./mockApi";
import {DataContext} from "../dataReducer";


export const renderWithMockContexts = (components, {apiOverride, dispatchOverride}={}) => {
    const _api = apiOverride ? {...api, [apiOverride.method]: apiOverride.func} : api;
    return render(
        <APIContext.Provider value={_api}>
            <DataContext.Provider value={dispatchOverride || jest.fn()}>
                {components}
            </DataContext.Provider>
        </APIContext.Provider>
    );
};
