import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Square コンポーネントは制御されたコンポーネント (controlled component)
// になったということです。
// Board が Square コンポーネントを全面的に制御しています。
// class Square extends React.Component {
//   // JavaScript のクラスでは、
//   // サブクラスのコンストラクタを定義する際は常に super を呼ぶ必要があります。
//   // constructor を持つ React のクラスコンポーネントでは、
//   // すべてコンストラクタを super(props) の呼び出しから始めるべきです。
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     value: null,
//   //   };
//   // }

//   render() {
//     // setState をコンポーネント内で呼び出すと、
//     // React はその内部の子コンポーネントも自動的に更新します。
//     // DOM 要素である <button> は組み込みコンポーネントなので、
//     // onClick 属性は React にとって特別な意味を持っています。
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// React における関数コンポーネントとは、
// render メソッドだけを有して自分の state を持たないコンポーネントを、
// よりシンプルに書くための方法です。
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // React では、イベントを表す props には on[Event] という名前、
    // イベントを処理するメソッドには、
    // handle[Event] という名前を付けるのが慣習となっています。
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0, // 現在ユーザに見せている着手を反映している
      xIsNext: true,
    };
  }

  // 履歴の更新, 次の手の情報の更新
  // マスをクリックするまでは、過去の手を表示していてもhistoryは更新されていない
  handleClick(i) {
    // this.state.history[this.state.stepNumber]が表示されている
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // クリックされたタイミングの盤面の状態をコピー
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      // this.state.history[this.state.stepNumber]の（コピーの）末尾に追加
      // concat() は元の配列をミューテートしない
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // state の更新はマージされるから、
  // より簡単に言うと、
  // React は setState で直接指定されたプロパティのみを更新し、
  // ほかの state はそのまま残す
  // historyは更新していない
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      nIsNext: step % 2 === 0,
    });
  }

  render() {
    // stateが更新されると再レンダリングされる？
    const history = this.state.history;
    // stepNumber によって現在選択されている着手をレンダーする
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
