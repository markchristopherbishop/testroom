import React from 'react';
import ReactDOM from 'react-dom';
import { TestItemPage } from './components/TestItemPage';
import { createGetTestItemService } from './services/testItemService';
import './index.css';

const getTestItemService = createGetTestItemService();

ReactDOM.render(<TestItemPage testItemService={getTestItemService} />, document.getElementById('root'));
