import { History } from 'history'
import * as React from 'react'
import van from'../images/van-336606_1280.jpg';

import {countryOptions} from '../constant';

import {
  Button,
  Grid,
  Header,
  Icon,
  Loader,
  Dropdown
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos} from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  location: string,
  name: string,
  loadingTodos: boolean}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    location: '',
    name: '',
    loadingTodos: true
    }

  handleNameChange = (event: React.SyntheticEvent<HTMLElement>, data: any) => {
    let name = '';

    if(countryOptions.some(x => {
      if (x.key === data.value){
        name  = x.text;
      }
    })) {
      return true
  }

    this.setState({ 
      location: data.value,
      name: name
    })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onEditNoteButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/editnote`)
  }

  onTodoCreate = async () => {
    try {
      console.log('location: ', this.state.location)
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        location: this.state.location,
        name: this.state.name
      })

      // const z = newTodo.attachmentUrl = "xxx"

      // console.log("set attachment")
      this.setState({
        todos: [...this.state.todos, newTodo]
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      console.log("heiii")
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        {this.renderDropDown()}

        {this.renderSaveButton()}

        {this.renderTodos()}
      </div>
    )
  }
  

  renderDropDown() {
    return (
    <Grid padded>
    <Grid.Row>
        <Grid.Column width={4}></Grid.Column>
        <Grid.Column width={4} >
        <Header as="h2">what plan travel for next week</Header>

        </Grid.Column>

        </Grid.Row>
        <Grid.Row>
        <Grid.Column width={4}></Grid.Column>
        <Grid.Column width={4} >
        <Dropdown
            placeholder='Select Country'
            fluid
            search
            selection
            options={countryOptions}
            onChange= {this.handleNameChange}
          />
        </Grid.Column>
        </Grid.Row>
  </Grid>

    )
  }

  renderSaveButton() {
    return (
      <Grid padded>
      <Grid.Row>
        <Grid.Column width={4}></Grid.Column>
        <Grid.Column width={4} >
        <Button 
        animated='fade'
        color="blue"
        size='big'
        onClick={() => {
          this.onTodoCreate(); 
        }}
        >
      <Button.Content hidden>Save</Button.Content>
      <Button.Content visible>
        <Icon name='save' />
      </Button.Content>
      </Button>

        </Grid.Column>

        </Grid.Row>
      </Grid>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading your trip
        </Loader>
      </Grid.Row>
    )
  }

  imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log(event)
    event.currentTarget.src= van;
    event.currentTarget.className = "error";
  };

  renderTodosList() {    
    return (
      <Grid padded>
        {this.state.todos.map((todo) => {
          return (
            <Grid.Row key={todo.todoId} className="rowContent">
              <Grid.Column width={4}></Grid.Column>
              <Grid.Column width={4} verticalAlign= 'middle'>
              {todo.attachmentUrl ?
                  <div className='fix-img'> <img src={todo.attachmentUrl} onError={this.imageOnErrorHandler} /> </div>:
                  <div className='fix-img'> <img src={van}/> </div>
              }
              </Grid.Column>

              <Grid.Column width={5}>
                <div><p>Name: {todo.name}</p></div>
                <div><p>Day temperature: {todo.dayTemp}°C</p></div>
                <div><p>Night temperature: {todo.nightTemp}°C</p></div>
                <div><p>Day Forecast: {todo.dayForecast}</p></div>
                <div><p>Night Forecast: {todo.nightForecast}</p></div>
                <div><p>Note: {todo.note}</p></div>
              </Grid.Column>
              <Grid.Column width={1}>
                <Button
                  icon
                  color="green"
                  onClick={() => this.onEditNoteButtonClick(todo.todoId)}
                >
                  <Icon name="sticky note" />
                </Button>
              </Grid.Column>   
              <Grid.Column width={1}>
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>              
              <Grid.Column width={1}>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  
}
}