import { create } from "zustand";

type PlayStore = {
    playFlag: boolean;
    playFileUrl: string;
    playFileList: string[];
    speakerFlag: boolean;
    play: (file: string) => void;
    pause: () => void;
};

const usePlayStore = create<PlayStore>()((set) => ({
    playFlag: false,
    playFileUrl: "",
    playFileList: [],
    speakerFlag: true,
    play: (fileUrl: string) => set({ playFlag: true, playFileUrl: fileUrl }),
    pause: () => set({ playFlag: false }),
}));

export { usePlayStore };
