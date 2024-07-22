import {
    createTableColumn,
    Table,
    TableBody,
    TableCell,
    TableCellLayout,
    TableColumnDefinition,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableSelectionCell,
    useTableFeatures,
    useTableSelection,
} from "@fluentui/react-components";
import React from "react";

type Item = {
    name: string;
    path: string;
};

const items: Item[] = [
    {
        name: "Meeting notes",
        path: "Max Mustermann",
    },
    {
        name: "Thursday presentation",
        path: "Erika Mustermann",
    },
    {
        name: "Training recording",
        path: "John Doe",
    },
    {
        name: "Purchase order",
        path: "Jane Doe",
    },
];

const columns: TableColumnDefinition<Item>[] = [
    createTableColumn<Item>({
        columnId: "name",
    }),
    createTableColumn<Item>({
        columnId: "path",
    }),
];

export function PlayListTable() {
    const {
        getRows,
        selection: { allRowsSelected, someRowsSelected, toggleAllRows, toggleRow, isRowSelected },
    } = useTableFeatures(
        {
            columns,
            items,
        },
        [
            useTableSelection({
                selectionMode: "multiselect",
                defaultSelectedItems: new Set([]),
            }),
        ]
    );

    const rows = getRows((row) => {
        const selected = isRowSelected(row.rowId);
        return {
            ...row,
            onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
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

    return (
        <Table aria-label="Table with multiselect" style={{ minWidth: "550px" }}>
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
                        <TableSelectionCell checked={selected} checkboxIndicator={{ "aria-label": "Select row" }} />
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
    );
}
