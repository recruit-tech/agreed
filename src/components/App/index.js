import React, { Component } from 'react'
import axios from 'axios'
import './styles.css'

import Navigation from '../Navigation'
import Agrees from '../Agrees'

const filterAgrees = (search, agrees) => {
  if (!search) return null

  const check = shoudDisplay(search)

  return agrees.filter(
    (agree) =>
      check(agree.title) ||
      check(agree.request.path) ||
      check(agree.request.method)
  )
}

const shoudDisplay = (search) => (value) => value && value.indexOf(search) > -1

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { agrees: null, search: '', agreesFiltered: null }
  }

  componentDidMount() {
    if (window.AGREES !== '__AGREES__') {
      return this.setState({ agrees: window.AGREES })
    }

    axios.get('agrees').then(({ data }) => this.setState({ agrees: data }))
  }

  onChange(value) {
    this.setState({
      search: value,
      agreesFiltered: filterAgrees(value, this.state.agrees),
    })
  }

  render() {
    const { agrees, agreesFiltered } = this.state
    if (!agrees) return null

    return (
      <div className="wrap">
        <header>
          <h1>Agreed UI</h1>
        </header>
        <div className="container">
          <main>
            <Agrees agrees={agreesFiltered || agrees} />
          </main>
          <aside>
            <p>Navigations</p>
            <section className="search">
              <input
                type="search"
                className="search__input"
                placeholder="Search"
                value={this.state.search}
                onChange={(e) => this.onChange(e.target.value)}
              />
            </section>
            <Navigation agrees={agreesFiltered || agrees} />
          </aside>
        </div>
      </div>
    )
  }
}

export default App
