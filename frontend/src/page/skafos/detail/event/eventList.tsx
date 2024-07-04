import * as React from "react";
import {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {DataGrid, GridColDef, useGridApiRef} from "@mui/x-data-grid";
import {TimerCounter} from "../../../../shared/component/TimerCounter";
import {SkafosApi} from "../../../../service/skafosApi";
import "./event-list.css";
import {Config} from "../../../../config";
import {useInterval} from "../../../../hooks/useInterval";


const columns: GridColDef[] = [
    {
        field: "type",
        headerName: "Type",
        flex: 1,
        headerAlign: "center",
        cellClassName: ({row: message}) => message.type,
        valueGetter: (params, row) => row.type,
    },
    {
        field: "message",
        headerName: "Message",
        flex: 7,
        headerAlign: "center",
        valueGetter: (params, row) => row.message,
    },
    {
        field: "row.metadata.namespace",
        headerName: "Namespace",
        flex: 2,
        headerAlign: "center",
        valueGetter: (params, row) => row.metadata.namespace,
    },
    {
        field: "involvedObject",
        headerName: "Involved Object",
        flex: 3,
        headerAlign: "center",
        valueGetter: (params, row) =>
            row.involvedObject.apiVersion +
            "/" +
            row.involvedObject.kind +
            "." +
            row.involvedObject.name,
    },
    {
        field: "count",
        headerName: "Count",
        flex: 1,
        headerAlign: "center",
        valueGetter: (params, row) => row.count,
    },
    {
        field: "firstTimestamp",
        headerName: "Age",
        flex: 1,
        renderCell: renderAge,
        headerAlign: "center",
    },
    {
        field: "lastTimestamp",
        headerName: "Last",
        flex: 1,
        renderCell: renderLast,
        headerAlign: "center",
    },
];

function renderType(params: any) {
    console.log(params.cellStyle);
    return params.cellStyle;
}

function renderAge(params: any) {
    let timestamp = 0;
    if (params.value !== null) {
        timestamp = new Date(params.value).getTime();
    } else if (params.row.eventTime !== null) {
        timestamp = new Date(params.row.eventTime).getTime();
    } else {
        return "";
    }
    return (
        <Box className="cellStyle">
            <TimerCounter timestampMills={timestamp}/>
        </Box>
    );
}

function renderLast(params: any) {
    let timestamp = 0;
    if (params.value !== null) {
        timestamp = new Date(params.value).getTime();
    } else {
        return "";
    }
    return (
        <Box className="cellStyle">
            <TimerCounter timestampMills={timestamp}/>
        </Box>
    );
}

const EventList: React.FC<{ namespace: string; name: string }> = ({
                                                                      namespace,
                                                                      name,
                                                                  }) => {
    const apiRef = useGridApiRef();
    const [events, setEvents] = useState<any[]>([]);
    const timerIdRef = useRef(0);
    const [isLoading, setIsLoading] = useState(true);

    const restorePaginationState = () => {
        const state = apiRef.current.exportState();
        const restoredState = {
            ...state,
            pagination: {
                ...state.pagination,
                paginationModel: {
                    ...state.pagination?.paginationModel,
                    page: 0,
                    pageSize: 20,
                },
            },
        };
        apiRef.current.restoreState(restoredState);
    };

    function fetchData(namespace: string, name: string){
        SkafosApi.getSkafosEvents(namespace, name)
            .then((result) => {
                setEvents(result.items);
            })
            .catch((error) => {
                console.error("An error occured:", error);
                setEvents([]);
            });
    }

    useEffect(() => {
        fetchData(namespace, name);
    }, []);

    useInterval( () => {
        fetchData(namespace, name)
    }, Config.pollingInterval)



    return (
        <Box className="boxContainer">
            {events && events.length > 0 ? (
                <DataGrid
                    sx={{
                        ".MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "bold !important",
                            fontSize: "medium",
                        },
                    }}
                    apiRef={apiRef}
                    onSortModelChange={() => restorePaginationState()}
                    rows={events}
                    columns={columns}
                    getRowId={(r) => r.metadata.namespace + "-" + r.metadata.name}
                    pageSizeOptions={[20]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                page: 0,
                                pageSize: 20,
                            },
                        },
                        sorting: {
                            sortModel: [{field: "lastTimestamp", sort: "desc"}],
                        },
                    }}
                    disableRowSelectionOnClick
                />
            ) : null}
        </Box>
    );
};

export default EventList;
