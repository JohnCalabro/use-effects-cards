import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";

//struggled on this exercise - this is a very slightly refactored solution.
//I AM NOT THE ORIGINAL DEV this is mostly Springboard's solution,
// this is mostly me documenting my understanding.
//  need to save time - at least I have learned more about side-effects,
// so not completely useless. 
//generally get what's going on. 
const URL = "http://deckofcardsapi.com/api/deck"; // base_url to interpolate.



function Deck() {   // deck starts null
  const [deck, setDeck] = useState(null);
  
  const [drawn, setDrawn] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

 
  useEffect(() => { //populate deck w/ API data

    async function populateDeck() {
      let deckData = await axios.get(`${URL}/new/shuffle/`);
      setDeck(deckData.data); 
    }
    populateDeck();
  }, [setDeck]); // does this mean deck is populated when page loads?

 
  useEffect(() => {
    
    async function getCard() {
      let { deck_id } = deck; //extract id from deck, once data is recieved

      try { //interpolate the id into url for draw card API call.
        let drawRes = await axios.get(`${URL}/${deck_id}/draw/`);

        if (drawRes.data.remaining === 0) {
          setAutoDraw(false);   // if none of 52 cards are left, turn off auto-draw
          throw new Error("no cards left!");  // throw error when 0 are left.
        }

        const card = drawRes.data.cards[0];  //if cards remain, make card instance

        setDrawn(d => [   //change state add to empty array for drawn cards
          ...d,    // copy w/ spread we have to change shallow copy
          { // cards drawn are added to array
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image // the image of the card to show on DOM @ draw
          }  // in obj we add id, name (suit + value i.e queen hearts)
        ]);
      } catch (err) {
        alert(err);
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();  // call getCard every second (1000 ms)
      }, 1000);
    } // causes a card to be drawn every second.

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;  // this will stop the cards from drawing
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto);
  }; //when clicked button toggle auto draw

  const cards = drawn.map(c => (
    <Card key={c.id} name={c.name} image={c.image} />
  ));   // Card component renders - mapped out instances of cards

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING!
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div> 
    </div>
  );
}
                    // ^ insert mapped out cards into DOM
export default Deck;



//feedback - assignment seems a bit too advanced to teach basics of hooks, mostly
// just confused me more and acted as a road-block. either too advanced or I'm 
// slightly behind on my skills.

