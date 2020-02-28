import React from 'react';

import { Template } from 'adaptive-templating-service-typescript-node';

import {
  CardManageButton,
  CardTitle,
  VersionCardHeader, 
  VersionCardRowTitle,
  DateWrapper,
  VersionCardRow, 
  VersionCardRowText,
  StatusWrapper
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
      <Card key="Recent Releases">
        <CardHeader>
          <VersionCardHeader>
            <CardTitle>Recent Releases</CardTitle>
            <CardManageButton>Manage</CardManageButton>
          </VersionCardHeader>
        </CardHeader>
        <CardBody>
          <VersionCardRow>
            <VersionCardRowTitle>Version</VersionCardRowTitle>
            <VersionCardRowTitle>Updated</VersionCardRowTitle>
            <VersionCardRowTitle>Status</VersionCardRowTitle>
          </VersionCardRow>  
          {this.props.template.instances!.map((instance) => (
            <VersionCardRow>
              <VersionCardRowText>{instance.version}</VersionCardRowText>
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
