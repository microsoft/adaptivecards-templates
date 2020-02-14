import React from 'react';
import { connect } from 'react-redux';

import { ModalBackdrop, ModalWrapper, ACPanel, ACWrapper, DescriptorWrapper } from './styled';
import AdaptiveCard from '../../Common/AdaptiveCard'
import TemplateInfo from './TemplateInfo';
import { setPage } from '../../../store/page/actions';

const mapDispatchToProps = (dispatch: any) => {
  return {
    setHeader: (header: string) => {
      dispatch(setPage(header))
    }
  }
}

const template = {
  "name": "Publish Schema Card",
  "instances": [
    {
      "json": "\"{\\\"type\\\":\\\"AdaptiveCard\\\",\\\"body\\\":[{\\\"type\\\":\\\"TextBlock\\\",\\\"size\\\":\\\"Medium\\\",\\\"weight\\\":\\\"Bolder\\\",\\\"text\\\":\\\"Publish Adaptive Card schema\\\"},{\\\"type\\\":\\\"ColumnSet\\\",\\\"columns\\\":[{\\\"type\\\":\\\"Column\\\",\\\"items\\\":[{\\\"type\\\":\\\"Image\\\",\\\"style\\\":\\\"Person\\\",\\\"url\\\":\\\"https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg\\\",\\\"size\\\":\\\"Small\\\"}],\\\"width\\\":\\\"auto\\\"},{\\\"type\\\":\\\"Column\\\",\\\"items\\\":[{\\\"type\\\":\\\"TextBlock\\\",\\\"weight\\\":\\\"Bolder\\\",\\\"text\\\":\\\"Matt Hidinger\\\",\\\"wrap\\\":true},{\\\"type\\\":\\\"TextBlock\\\",\\\"spacing\\\":\\\"None\\\",\\\"text\\\":\\\"Created {{DATE(2017-02-14T06:08:39Z,SHORT)}}\\\",\\\"isSubtle\\\":true,\\\"wrap\\\":true}],\\\"width\\\":\\\"stretch\\\"}]},{\\\"type\\\":\\\"TextBlock\\\",\\\"text\\\":\\\"Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.\\\",\\\"wrap\\\":true},{\\\"type\\\":\\\"FactSet\\\",\\\"facts\\\":[{\\\"title\\\":\\\"Board:\\\",\\\"value\\\":\\\"Adaptive Card\\\"},{\\\"title\\\":\\\"List:\\\",\\\"value\\\":\\\"Backlog\\\"},{\\\"title\\\":\\\"Assigned to:\\\",\\\"value\\\":\\\"Matt Hidinger\\\"},{\\\"title\\\":\\\"Due date:\\\",\\\"value\\\":\\\"Not set\\\"}]}],\\\"actions\\\":[{\\\"type\\\":\\\"Action.ShowCard\\\",\\\"title\\\":\\\"Set due date\\\",\\\"card\\\":{\\\"type\\\":\\\"AdaptiveCard\\\",\\\"body\\\":[{\\\"type\\\":\\\"Input.Date\\\",\\\"id\\\":\\\"dueDate\\\"},{\\\"type\\\":\\\"Input.Text\\\",\\\"id\\\":\\\"comment\\\",\\\"placeholder\\\":\\\"Add a comment\\\",\\\"isMultiline\\\":true}],\\\"actions\\\":[{\\\"type\\\":\\\"Action.OpenUrl\\\",\\\"title\\\":\\\"OK\\\",\\\"url\\\":\\\"http://adaptivecards.io\\\"}],\\\"$schema\\\":\\\"http://adaptivecards.io/schemas/adaptive-card.json\\\"}},{\\\"type\\\":\\\"Action.OpenUrl\\\",\\\"title\\\":\\\"View\\\",\\\"url\\\":\\\"http://adaptivecards.io\\\"}],\\\"$schema\\\":\\\"http://adaptivecards.io/schemas/adaptive-card.json\\\",\\\"version\\\":\\\"1.0\\\"}\"",
      "version": "1.0"
    }
  ],
  "tags": [],
  "owner": "af6961db-ad80-4453-a061-8539ed04fd5e",
  "createdAt": "2020-02-12T02:56:44.450Z",
  "_id": "544b7a6d-4ed2-44e2-899f-6c1e8bdcfb90"
}

interface Props {
  show: boolean;
  toggleModal: () => void;
  setHeader: (header: string) => void;
}

class PreviewModal extends React.Component<Props, {}> {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.show !== this.props.show) {
      this.props.setHeader(this.props.show ? template.name : 'Dashboard');
    }
  }

  render() {
    return this.props.show ? (
      <ModalBackdrop>
        <ModalWrapper>
          <ACPanel>
            <ACWrapper>
              {/* TODO add redux store functionality for individual cards */}
              <AdaptiveCard cardtemplate={template} />
            </ACWrapper>
          </ACPanel>
          <DescriptorWrapper>
            <TemplateInfo template={template} onClose={this.props.toggleModal} />
          </DescriptorWrapper>
        </ModalWrapper>
      </ModalBackdrop>
    ) : null;
  }
}

export default connect(() => { }, mapDispatchToProps)(PreviewModal);
