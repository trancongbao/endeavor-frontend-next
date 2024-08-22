import React from "react";
import './DeckTile.scss';

export default function DeckTile({ deck }: { deck: any }) {
  console.log("deck.subdecks: ", deck.subdecks);
  return (
    <div className="deck-card p-2">
      <p className="title">{deck.title}</p>
      <table className="sub-decks-table">
        <tbody>
          {deck.subdecks.map((subdeck: any) => (
            <tr className="body-row" key={subdeck.order}>
              <td className="row-title">{subdeck.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="action-btns">
        Browse
      </div>
    </div>
  );
}
