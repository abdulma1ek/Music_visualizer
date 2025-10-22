import type { Metadata } from "next";

import { PlayerScreen } from "./PlayerScreen";

export const metadata: Metadata = {
  title: "Player | Music Visualizer"
};

export default function PlayerPage() {
  return <PlayerScreen />;
}
