import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    Field,
    Input,
    Label,
} from "@fluentui/react-components";
import { AddFilled } from "@fluentui/react-icons";
import Database from "@tauri-apps/plugin-sql";
import { useState } from "react";
import { PlayListName } from "../interfaces/PlayListName";

type CreatePlayListProps = {
    database: Database | null;
    playLists: PlayListName[];
    onCreateSuccess: (newPlayListName: string) => void;
};

export function CreatePlayList({ database, playLists, onCreateSuccess }: CreatePlayListProps) {
    const [newPlayListDialogOpen, setNewPlayListDialogOpen] = useState<boolean>(false);
    const [newPlayListName, setNewPlayListName] = useState<string>("");
    const [newPlayListErrorMessage, setNewPlayListErrorMessage] = useState<undefined | string>("播放列表名称不能为空");

    const handleNewPlayListNameChanged = (name: string) => {
        let trimmedName = name.trim();
        setNewPlayListName(trimmedName);
        if (trimmedName.length == 0) {
            setNewPlayListErrorMessage("播放列表名称不能为空");
            return;
        }
        if (playLists.find((playList) => playList.name == trimmedName)) {
            setNewPlayListErrorMessage("播放列表名称已存在");
            return;
        }
        setNewPlayListErrorMessage(undefined);
    };

    const handleCancelNewPlayList = () => {
        setNewPlayListDialogOpen(false);
        setNewPlayListName("");
        setNewPlayListErrorMessage("播放列表名称不能为空");
    };

    const handleCreateNewPlayList = async () => {
        try {
            await database?.execute(`CREATE TABLE ${newPlayListName} (id INTEGER PRIMARY KEY, name TEXT, path TEXT);`);
        } catch (e) {
            setNewPlayListErrorMessage("播放列表名称已存在");
            return;
        }
        onCreateSuccess(newPlayListName);
        setNewPlayListDialogOpen(false);
        setNewPlayListName("");
        setNewPlayListErrorMessage("播放列表名称不能为空");
    };

    return (
        <Dialog open={newPlayListDialogOpen}>
            <Button
                appearance="transparent"
                icon={<AddFilled />}
                onClick={() => {
                    setNewPlayListDialogOpen(true);
                }}
            >
                新建播放列表
            </Button>
            <DialogSurface>
                <DialogBody>
                    <DialogContent>
                        <Field validationState="error" validationMessage={newPlayListErrorMessage}>
                            <Label htmlFor="new-play-list-name-id">播放列表名称</Label>
                            <Input
                                id="new-play-list-name-id"
                                appearance="underline"
                                value={newPlayListName}
                                onChange={(e) => handleNewPlayListNameChanged(e.target.value)}
                            />
                        </Field>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={handleCancelNewPlayList}>
                            取消
                        </Button>
                        <Button
                            appearance="primary"
                            disabled={newPlayListErrorMessage != undefined}
                            onClick={handleCreateNewPlayList}
                        >
                            确认
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
