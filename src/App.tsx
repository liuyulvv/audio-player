import {
    Divider,
    FluentProvider,
    makeStyles,
    Tab,
    TabList,
    teamsDarkTheme,
    teamsLightTheme,
} from "@fluentui/react-components";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { CreatePlayList } from "./components/CreatePlayList";
import { Player } from "./components/Player";
import { PlayListContent } from "./components/PlayListContent";
import { PlayListName } from "./interfaces/PlayListName";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    header: {
        height: "64px",
        display: "flex",
        alignItems: "center",
    },
    content: {
        display: "flex",
        width: "100%",
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "0%",
    },
    main: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "0%",
        alignItems: "center",
    },
    aside: {
        display: "flex",
    },
});

export function App() {
    const styles = useStyles();
    const [theme, setTheme] = useState("light");
    const [database, setDatabase] = useState<Database | null>(null);
    const [playLists, setPlayLists] = useState<PlayListName[]>([]);

    const [selectedPlayList, setSelectedPlayList] = useState<string | null>(null);

    useEffect(() => {
        const initDatabase = async () => {
            const db = await Database.load("sqlite:audio-player.sqlite3");
            setDatabase(db);
            const tables: Array<PlayListName> = await db.select("SELECT name FROM sqlite_master WHERE type='table';");
            setPlayLists(tables);
            if (tables.length > 0) {
                setSelectedPlayList(tables[0].name);
            }
        };
        initDatabase();
    }, []);

    return (
        <FluentProvider theme={theme == "dark" ? teamsDarkTheme : teamsLightTheme}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Player />
                </div>
                <div className={styles.content}>
                    <div className={styles.aside}>
                        <div>
                            <Divider />
                            <TabList
                                vertical
                                selectedValue={selectedPlayList}
                                onTabSelect={(_, data) => {
                                    setSelectedPlayList(data.value as string);
                                }}
                            >
                                {playLists.map((playList) => (
                                    <Tab value={playList.name} key={playList.name}>
                                        {playList.name}
                                    </Tab>
                                ))}
                            </TabList>
                            <Divider />
                            <CreatePlayList
                                database={database}
                                playLists={playLists}
                                onCreateSuccess={function (newPlayListName: string): void {
                                    setPlayLists([...playLists, { name: newPlayListName }]);
                                }}
                            />
                        </div>
                        <Divider vertical />
                    </div>
                    <div className={styles.main}>
                        <PlayListContent database={database} playlist={selectedPlayList} />
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
}
