const contentNode = document.getElementById('contents');
const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
const message = continents.map(c => `Hello ${c}!`).join(' ');

var component = <h1 className={'test_class'}>{message}</h1>;
ReactDOM.render(component, contentNode);
