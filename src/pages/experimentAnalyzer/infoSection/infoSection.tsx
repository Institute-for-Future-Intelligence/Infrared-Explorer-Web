import { Tabs, TabsProps } from 'antd';
import Description from './description';
import { Experiment } from '../../../types';

interface InfoSectionProps {
  experiment: Experiment;
}

const InfoSection = ({ experiment }: InfoSectionProps) => {
  const commentCount = experiment.commentsId ? experiment.commentsId.length : 0;

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Description',
      children: <Description experiment={experiment} />,
    },
  ];

  if (experiment.commentsId) {
    items.push({
      key: '2',
      label: 'Comment' + (commentCount > 0 ? `s(${commentCount})` : ''),
      children: 'Content of Tab Pane 2',
    });
  }

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default InfoSection;
