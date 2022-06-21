import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { patchTodo} from '../api/todos-api'
import {UpdateTodoRequest} from '../types/UpdateTodoRequest'


interface EditNoteProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
  history: History

}

interface EditNoteState {
  note: string
}

export class EditNote extends React.PureComponent<EditNoteProps,EditNoteState> {
  state: EditNoteState = {
    note: ''
  }

  handleFileChange = (event: any) => {
    const text = event.target.value
    if (!text) return

    this.setState({
      note: text
    })
  }

  handleSubmit = async () => {
    try {
      const stateNote: UpdateTodoRequest = {
        note: this.state.note
      }

      const update = await patchTodo(this.props.auth.getIdToken(), this.props.match.params.todoId, stateNote)

      this.setState({
        note: ''
      })

      alert('Note was uploaded!')
    } catch {
      alert('Todo update failed')
    } finally {
          this.props.history.push(`/`)
    }}

  render() {
    return (
      <div>
        <h1>update note</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.TextArea label='About' placeholder='Note that...' onChange={this.handleFileChange} />
          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        <Button
          type="submit"
        >
          Submit
        </Button>
      </div>
    )
  }
}
