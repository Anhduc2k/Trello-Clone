import React from 'react'
import { mapOrder } from '../../ultilities/sorts'
import Card from '../Card/Card'
import './Column.scss'
export default function Column(props) {
  const { column } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  return (
    <div className="column">
      <header>{column.title}</header>
      <ul className="card-list">
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </ul>
      <footer>Add another card</footer>
    </div>
  )
}
