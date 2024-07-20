import React from "react";

export default function DeckTile({ deck }: { deck: any }) {
  console.log("deck.subdecks: ", deck.subdecks);
  return (
    <div className="deck-card">
      <h2 className="title">{deck.title}</h2>
      <table className="sub-decks-table">
        <thead className="table-head"></thead>
        <tbody className="table-body">
          {deck.subdecks.map((subdeck: any) => (
            <tr className="body-row" key={subdeck.order}>
              <td className="row-title">{subdeck.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="action-btns">
        {/* <NavLink className="inline-btn edit-btn" to={`${deck.id}`}> */}
        Browse
        {/* </NavLink> */}
      </div>
    </div>
  );
}
