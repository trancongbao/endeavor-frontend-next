import DeckTile from "./DeckTile";
import { Key } from "react";

export default async function Decks() {
  const myDecks = await getMyDecks();

  return (
    <div className="my-decks-grid-container">
      <div>Decks</div>
      {myDecks.map((deck: { id: Key | null | undefined }) => {
        <DeckTile key={deck.id} deck={deck} />;
      })}
    </div>
  );
}

function getMyDecks() {
  return fetch("http://localhost:3000/teach", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method: "getDecks",
      params: {},
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log(`Response is not successful: status = ${response.status}.`);
        return [];
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching decks:", error.message);
      return [];
    });
}
