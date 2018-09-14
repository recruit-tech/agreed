import React, { Component } from 'react'
import axios from 'axios'
import './styles.css'

import Navigation from '../Navigation'
import Agrees from '../Agrees'

const titlePlaceHolder = '"<%= title %>"'

const filterAgrees = (search, agrees) => {
  if (!search) return null

  const check = shoudDisplay(search)

  return agrees.filter(
    (agree) =>
      check(agree.title) ||
      check(agree.request.path) ||
      check(agree.request.method),
  )
}

const shoudDisplay = (search) => (value) => value && value.indexOf(search) > -1

const insertId = (agrees) => agrees.map((agree, i) => ({...agree, id: `agree_${i}`}))

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agrees: null,
      search: '',
      grouped: false,
      agreesFiltered: null,
      title: '',
    }
  }

  defaultTitle = 'Agreed UI'

  componentDidMount() {
    const title = window.TITLE === titlePlaceHolder ? '' : (window.TITLE || '')

    if (title) document.title = title

    if (Array.isArray(window.AGREES)) {
      return this.setState({ title, agrees: insertId(window.AGREES) })
    }

    axios
      .get('agrees')
      .then(({ data }) => this.setState({ title, agrees: insertId(data) }))
  }

  onSearchTextChange(value) {
    this.setState({
      search: value,
      agreesFiltered: filterAgrees(value, this.state.agrees),
    })
  }

  onFilterChange(value) {
    this.setState({
      grouped: value,
    })
  }

  render() {
    const { agrees, agreesFiltered, title, search, grouped } = this.state
    if (!agrees) return null

    return (
      <div className="wrap">
        <header>
          <h1>{title || this.defaultTitle}</h1>
          {title && <p>{this.defaultTitle}</p>}
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
                value={search}
                onChange={(e) => this.onSearchTextChange(e.target.value)}
              />
              <span className="search__group">
                <label>
                  <input
                    type="checkbox"
                    checked={grouped}
                    onChange={(e) => this.onFilterChange(e.target.checked)} />
                    &nbsp;group by request.path
                </label>
              </span>
            </section>
            <Navigation grouped={grouped} agrees={agreesFiltered || agrees} />
          </aside>
        </div>
      </div>
    )
  }
}

export default App
