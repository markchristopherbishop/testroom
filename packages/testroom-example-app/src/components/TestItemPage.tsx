import React from 'react';
import styled from 'styled-components';
import { GetTestItemService, TestItemType, TestItem } from '../services/testItemService';
import { HomeIcon, EyeIcon, MapIcon } from './Icons';

const Root = styled.section`
  height: 100%;
  min-height: 100%;
`;

const Title = styled.div`
  background: #F6F7F8;
  color: #3A2D32;
  height: 80px;
  padding-top: 30px;
  padding-left: 30px;
  font-size: 30px;
`;

const Results = styled.div`
  background: #2EC4B6;
  flex: 1;
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
`;

const Icons = styled.div`
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 60px;
    width: 60px;
    stroke: #455E5CDark;
  }
`;

const Description = styled.div`
  padding: 20px;
  font-size: 20px;
`;

const ResultItem = styled.section`
  color: #3A2D32;
  background: #A9E7E1;
  min-height: 100px;
  max-width: 600px;
  display: flex;
  margin-top: 10px;
`;

const Buttons = styled.div`
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditButton = styled.button`
  color: white;
  background: #C42E3C;
  padding: 10px;
  border: 0;
  font-size: 20px;
`;

const NoResults = styled.section``;

interface Props {
  testItemService: GetTestItemService;
}

interface State {
  items: TestItem [];
}

const getIcon = (type: TestItemType) => {
  switch (type) {
    case TestItemType.Eye: return EyeIcon;
    case TestItemType.Home: return HomeIcon;
    case TestItemType.Map: return MapIcon;
  }
}

export class TestItemPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      items: [],
    };
  }
  async componentWillMount() {
    let items: TestItem [];
    try {
      items = await this.props.testItemService();
    } catch (err) {
      console.error(err);
      items = [];
    } 
    this.setState({ items });
  }
  render() {
    return (
      <Root>
        <Title>Test Items</Title>
        <Results>
          {this.state.items && this.state.items.length > 0 ? this.state.items.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <ResultItem data-type="result-item" key={item.id}>
                <Icons>
                  <Icon/>
                </Icons>
                <Description>{item.name}</Description>
                <Buttons>
                  <EditButton>
                    Edit
                  </EditButton>
                </Buttons>
              </ResultItem>
            );
          }) : <NoResults>No Items</NoResults>}
        </Results>
      </Root>
    );
  }
}
