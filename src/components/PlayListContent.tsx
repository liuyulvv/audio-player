import {
    Button,
    createTableColumn,
    Divider,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableCellLayout,
    TableColumnDefinition,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableSelectionCell,
    useTableColumnSizing_unstable,
    useTableFeatures,
    useTableSelection,
} from "@fluentui/react-components";
import { AddSquareMultipleRegular } from "@fluentui/react-icons";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import Database from "@tauri-apps/plugin-sql";
import React, { useEffect, useState } from "react";
import { PlayListFile } from "../interfaces/PlayListFile";
import { usePlayStore } from "../store/usePlayStore";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
    },
    header: {},
});

type PlayListContentProps = {
    database: Database | null;
    playlist: string | null;
};

const columns: TableColumnDefinition<PlayListFile>[] = [
    createTableColumn<PlayListFile>({
        columnId: "name",
    }),
    createTableColumn<PlayListFile>({
        columnId: "path",
    }),
];

export function PlayListContent({ database, playlist }: PlayListContentProps) {
    const styles = useStyles();

    const [playListFiles, setPlayListFiles] = useState<PlayListFile[]>([]);

    useEffect(() => {});

    // const loadPlayListFiles = async () => {
    //     if (database && playlist) {
    //         const files = await database.select<Array<Item>>(`SELECT * FROM ${playlist};`);
    //         setPlayListFiles(files);
    //     }
    // };

    const {
        getRows,
        selection: { allRowsSelected, someRowsSelected, toggleAllRows, toggleRow, isRowSelected },
    } = useTableFeatures(
        {
            columns,
            items: playListFiles,
        },
        [
            useTableSelection({
                selectionMode: "multiselect",
                defaultSelectedItems: new Set([]),
            }),
            useTableColumnSizing_unstable({
                autoFitColumns: false,
            }),
        ]
    );

    const rows = getRows((row) => {
        const selected = isRowSelected(row.rowId);
        return {
            ...row,
            onClick: (e: React.MouseEvent) => {
                if (e.detail == 2) {
                    const url = convertFileSrc(row.item.path);
                    usePlayStore.getState().play(url);
                }
            },
            onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === " ") {
                    e.preventDefault();
                    toggleRow(e, row.rowId);
                }
            },
            selected,
            appearance: selected ? ("brand" as const) : ("none" as const),
        };
    });

    const toggleAllKeydown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === " ") {
                toggleAllRows(e);
                e.preventDefault();
            }
        },
        [toggleAllRows]
    );

    const handleAddFiles = async () => {
        const files = await open({
            multiple: true,
            directory: false,
        });
        const addFiles: Array<PlayListFile> = [];
        files?.forEach((file) => {
            if (file.name) {
                addFiles.push({
                    name: file.name,
                    path: file.path,
                });
            }
        });
        handlePlayListFilesChanged(addFiles);
    };

    const handlePlayListFilesChanged = (files: PlayListFile[]) => {
        const updateFiles = [...playListFiles, ...files];
        updateFiles.sort((a, b) => a.name.localeCompare(b.name));
        setPlayListFiles(updateFiles);
    };

    return playlist ? (
        <div className={styles.container}>
            <Divider />
            <div className={styles.header}>
                <Button appearance={"transparent"}>{playlist}</Button>
                <Button appearance={"transparent"} icon={<AddSquareMultipleRegular />} onClick={handleAddFiles}>
                    添加
                </Button>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableSelectionCell
                                checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
                                onClick={toggleAllRows}
                                onKeyDown={toggleAllKeydown}
                                checkboxIndicator={{ "aria-label": "Select all rows " }}
                            />

                            <TableHeaderCell>名称</TableHeaderCell>
                            <TableHeaderCell>路径</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map(({ item, selected, onClick, onKeyDown, appearance }) => (
                            <TableRow
                                key={item.name}
                                onClick={onClick}
                                onKeyDown={onKeyDown}
                                aria-selected={selected}
                                appearance={appearance}
                            >
                                <TableSelectionCell
                                    checked={selected}
                                    checkboxIndicator={{ "aria-label": "Select row" }}
                                />
                                <TableCell>
                                    <TableCellLayout>{item.name}</TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>{item.path}</TableCellLayout>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    ) : null;
}
