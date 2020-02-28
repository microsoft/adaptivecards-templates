import React from 'react';

import { Template } from 'adaptive-templating-service-typescript-node';

import {
  CardManageButton,
  CardTitle,
  VersionCardHeader, 
  VersionCardRowTitle,
  DateWrapper,
  VersionCardRow,
  StatusWrapper,
  VersionIcon, 
  VersionWrapper
} from './styled'

import {
  Card,
  CardHeader,
  CardBody, 
  StatusIndicator, 
  Status
} from './../styled';


interface Props {
  template: Template;
  templateVersion: string;
}


class VersionCard extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  updatedDate = (updatedAt: string | undefined): string => {
    const oneDay = 24 * 60 * 60 * 1000;
    const hour = 60 * 60 * 1000;
    if (!updatedAt) return "N/A";
    let currentDate = new Date();
    let updatedDate = new Date(updatedAt);
    let daysAgo = Math.round(Math.abs((currentDate.getTime() - updatedDate.getTime()) / oneDay));
    let hoursAgo = 0;
    if (daysAgo === 0){
      hoursAgo = Math.round(Math.abs((currentDate.getTime() - updatedDate.getTime()) / hour));
    }
    let result = daysAgo === 0? `${hoursAgo} hours ago` : `${daysAgo} days ago`;
    return result;
  }

  render() {
    return (
      <Card key="Recent Releases" style={{width: `100%`}}>
        <CardHeader>
          <VersionCardHeader>
            <CardTitle>Recent Releases</CardTitle>
            <CardManageButton>Manage</CardManageButton>
          </VersionCardHeader>
        </CardHeader>
        <CardBody>
          <VersionCardRow>
            <VersionCardRowTitle style={{flexBasis: `15%`}}>Version</VersionCardRowTitle>
            <VersionCardRowTitle style={{flexBasis: `25%`}}>Updated</VersionCardRowTitle>
            <VersionCardRowTitle style={{flexBasis: `20%`}}>Status</VersionCardRowTitle>
          </VersionCardRow>  
          {this.props.template.instances!.map((instance) => (
            <VersionCardRow>
              <VersionWrapper>
                {instance.version}
                {instance.version === this.props.templateVersion && <VersionIcon iconName={'View'}></VersionIcon>}
              </VersionWrapper>      
              <DateWrapper>{this.updatedDate(instance.updatedAt)}</DateWrapper>
              <StatusWrapper>
                <StatusIndicator state = {instance.state}/>
                <Status>{instance.state!.toString().charAt(0).toUpperCase() + instance.state!.toString().slice(1)}</Status>
              </StatusWrapper>
            </VersionCardRow>
          ))}       
        </CardBody>
      </Card>
    );
  }
}

export default VersionCard;
