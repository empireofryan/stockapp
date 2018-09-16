import React, { Component } from 'react'
// import ReactTable from "react-table"
import './App.css'
// import 'react-table/react-table.css'
import database from './Firebase'

class StocksTable extends Component {
  constructor(props) {
    super(props)
  }
  render () {
    const data = Array.from(this.props.data);
    console.log('this props data', this.props.data);
    console.log('data', data)
    return (
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Change</td>
            <td>Open</td>
            <td>Close</td>
          </tr>
        </thead>
        <tbody>
          
          { 
            data.map((stock, index) => {
              const {todaysReturn, afterHours, close} = stock;
              return <tr>
                <td></td>
                <td>{index}</td>
                {/* <td>{stock.todaysReturn}</td>
                <td>{stock.afterHours}</td>
                <td>{stock.close}</td> */}
              </tr>
            })}
        </tbody>
      </table>
    )
  }
}

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stocks: [
        {id: 403, symbol: 'CRON', todaysReturn: '1.9%', afterHours: '2.4%', complete: 100}, 
        {id: 532, symbol: 'NFLX', todaysReturn: '3.9%', afterHours: '-1.2%', complete: 30},
      ],
    }
    this.stockRef = database.ref()
    this.checkboxInput = React.createRef()
    this.gotData = this.gotData.bind(this);
  }
  componentDidMount () {
    this.stockRef.on('value', this.gotData, this.errData)
  }

  gotData (data) {
    const inquirydata = data.val()
    function findProp (obj, key, out) {
      let i
      let proto = Object.prototype
      let ts = proto.toString
      let hasOwn = proto.hasOwnProperty.bind(obj)

      if (ts.call(out) !== '[object Array]') out = []
      for (i in obj) {
        if (hasOwn(i)) {
          if (i === key) {
            out.push(obj[i])
          } else if (ts.call(obj[i]) === '[object Array]' || ts.call(obj[i]) === '[object Object]') {
            findProp(obj[i], key, out)
          }
        }
      }

      return out
    }
    const stocksForDay = findProp(inquirydata, '2018-09-06 15:47')
    const stockKeys = Object.keys(stocksForDay).map(k => stocksForDay[k])
    const stockValues = Object.values(stockKeys)
    const newStocks = stockValues[0]
    console.log(newStocks['AMD']);
    console.log(this.state);
    //console.log('this state stocks', this.state.stocks);
    this.setState({ stocks: newStocks })
    // this.setState({
    //   stocks: [...this.state.stocks, newStocks]
    // })
  }
  errData (err) {
    console.log('err', err)
  }
  render () {
    return (
      <div>
        <div>
          <h1>Stocks</h1>
        </div>
        <div>
          <StocksTable data={this.state.stocks} />
        </div>
      </div>
    )
  }
}