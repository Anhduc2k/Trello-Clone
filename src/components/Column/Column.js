import { cloneDeep } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Dropdown, Form } from 'react-bootstrap'
import { Container, Draggable } from 'react-smooth-dnd'
import { MODAL_ACTION_CONFIRM } from '../../ultilities/constants'
import { saveContentAfterPressEnter, selectAllInLineText } from '../../ultilities/contentEditable'
import { mapOrder } from '../../ultilities/sorts'
import Card from '../Card/Card'
import ConfirmModal from '../Commom/ConfirmModal'
import './Column.scss'
export default function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = e => setColumnTitle(e.target.value)

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
  }

  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewCardTitleChange = e => setNewCardTitle(e.target.value)

  const newCardTextareaRef = useRef(null)
  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus()
      newCardTextareaRef.current.select()
    }
  }, [openNewCardForm])

  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)
  const onConfirmModalAction = type => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumn)
    }
    toggleShowConfirmModal()
  }
  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColumn)
  }

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus()
      return
    }
    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5), // 5 random characters, will remove when we implement code api
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null
    }
    let newColumn = cloneDeep(column)
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)
    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toggleOpenNewCardForm()
  }

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInLineText}
            onMouseDown={e => e.preventDefault()}
            spellCheck="false"
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn" />

            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleOpenNewCardForm}>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column ...</Dropdown.Item>
              <Dropdown.Item>Move all card in this column... </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="col"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this card..."
              className="textarea-enter-new-card"
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
              onKeyDown={event => event.key === 'Enter' && addNewCard()}
            />
          </div>
        )}
      </div>
      <footer>
        {openNewCardForm && (
          <div className="add-new-card-actions">
            <Button variant="success" size="sm" onClick={addNewCard}>
              Add column
            </Button>
            <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
              <i className="fa fa-times icon"></i>
            </span>
          </div>
        )}
        {!openNewCardForm && (
          <div className="footer-actions" onClick={toggleOpenNewCardForm}>
            <i className="fa fa-plus icon" />
            Add another card
          </div>
        )}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>. <br /> All cards will also be removed`}
      />
    </div>
  )
}
