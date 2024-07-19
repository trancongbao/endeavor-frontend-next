import React from "react";

export default function DeckTile({ deck }: { deck: any }) {
  return (
    <div className="deck-card">
      <h2 className="title">{deck.title}</h2>
      <table className="sub-decks-table">
        <thead className="table-head">
          <tr>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody className="table-body">
          {deck.subdecks.map((subDeck: any) => (
            <tr className="body-row" key={subDeck.id}>
              <td className="row-title">{subDeck.subdeck_title}</td>
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
