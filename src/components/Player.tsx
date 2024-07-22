import { Button, Field, makeStyles, ProgressBar } from "@fluentui/react-components";
import {
    NextRegular,
    PauseRegular,
    PlayCircleRegular,
    PreviousRegular,
    Speaker1Regular,
    SpeakerMuteRegular,
} from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { usePlayStore } from "../store/usePlayStore";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    main: {
        display: "flex",
        justifyContent: "center",
    },
});

export function Player() {
    const styles = useStyles();
    const playFileUrl = usePlayStore((state) => state.playFileUrl);
    const playFlag = usePlayStore((state) => state.playFlag);
    const speakerFlag = usePlayStore((state) => state.speakerFlag);

    const [audio] = useState(new Audio());
    const [duration, setDuration] = useState(1);
    const [currentTime, setCurrentTime] = useState(1);

    useEffect(() => {
        audio.src = playFileUrl;
        if (playFlag) {
            audio.play();
        } else {
            audio.pause();
        }

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
        };
    }, [playFileUrl, audio]);

    return (
        <div className={styles.container}>
            <Field>
                <ProgressBar max={duration} value={currentTime} />
            </Field>

            <div className={styles.main}>
                <Button icon={<PreviousRegular />} appearance="transparent" />
                {playFlag ? (
                    <Button icon={<PauseRegular />} appearance="transparent" />
                ) : (
                    <Button icon={<PlayCircleRegular />} appearance="transparent" />
                )}
                <Button icon={<NextRegular />} appearance="transparent" />
                {speakerFlag ? (
                    <Button icon={<SpeakerMuteRegular />} appearance="transparent" />
                ) : (
                    <Button icon={<Speaker1Regular />} appearance="transparent" />
                )}
            </div>
        </div>
    );
}
