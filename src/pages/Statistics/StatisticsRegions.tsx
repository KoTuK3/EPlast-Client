import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Select,
  Layout,
  Modal,
  Row,
  Col,
  TreeSelect,
  Typography
} from "antd";
import StatisticsApi from "../../api/StatisticsApi";
import StatisticsItemIndicator from "./Interfaces/StatisticsItemIndicator";
import DataFromResponse from "./Interfaces/DataFromResponse";
import { SortOrder } from "antd/lib/table/interface";
import RegionsApi from "../../api/regionsApi";
import Region from "./Interfaces/Region";
import RegionStatistics from "./Interfaces/RegionStatistics";
import{ shouldContain } from "../../components/Notifications/Messages"
import "./StatisticsRegions.less";
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction
} from "bizcharts";

const StatisticsCities = () => {

  const [years, setYears] = useState<any>();
  const [result, setResult] = useState<DataFromResponse[]>(Array());
  const [showTable, setShowTable] = useState(false);
  const [columns, setColumns] = useState(Array());
  const [regions, setRegions] = useState<any>();
  const [dataChart, setDataChart] = useState(Array());
  const [dataFromRow, setDataFromRow] = useState<DataFromResponse>();
  const [arrayOfInindicators, setArrayOfIndicators] = useState<any[]>(Array());
  const [title, setTitle] = useState<DataFromResponse>();
  const [selectableUnatstvaPart, setSelectableUnatstvaPart] = useState<boolean>();
  const [selectableUnatstvaZahalom, setSelectableUnatstvaZahalom] = useState<boolean>();
  const [selectableSeniorPart, setSelectableSeniorPart] = useState<boolean>();
  const [selectableSeniorZahalom, setSelectableSeniorZahalom] = useState<boolean>();
  const [selectableSeigneurPart, setSelectableSeigneurPart] = useState<boolean>();
  const [selectableSeigneurZahalom, setSelectableSeigneurZahalom] = useState<boolean>();
  const [onClickRow, setOnClickRow] = useState<any>();

  const constColumns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.id - b.id },
      width: 55
    },
    {
      title: "Округа",
      dataIndex: "regionName",
      key: "regionName",
      fixed: "left",
      ellipsis: {
        showTitle: true,
      },
      sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      width: 100
    },
    {
      title: "Рік",
      dataIndex: "year",
      key: "year",
      fixed: "left",
      sorter: { compare: (a: any, b: any) => a.year - b.year },
      width: 100
    }    
  ];

  const indicatorsArray = [
    { value: StatisticsItemIndicator.NumberOfPtashata, label: "Кількість пташат" },
    { value: StatisticsItemIndicator.NumberOfNovatstva, label: "Кількість новацтва" },
    { value: StatisticsItemIndicator.NumberOfUnatstva, label: "Кількість юнацтва загалом" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaNoname, label: "Кількість неіменованих" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaSupporters, label: "Кількість прихильників" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaMembers, label: "Кількість учасників" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaProspectors, label: "Кількість розвідувачів" },
    { value: StatisticsItemIndicator.NumberOfUnatstvaSkobVirlyts, label: "Кількість скобів/вірлиць" },
    { value: StatisticsItemIndicator.NumberOfSenior, label: "Кількість старших пластунів загалом" },
    { value: StatisticsItemIndicator.NumberOfSeniorPlastynSupporters, label: "Кількість старших пластунів прихильників" },
    { value: StatisticsItemIndicator.NumberOfSeniorPlastynMembers, label: "Кількість старших пластунів учасників" },
    { value: StatisticsItemIndicator.NumberOfSeigneur, label: "Кількість сеньйорів загалом" },
    { value: StatisticsItemIndicator.NumberOfSeigneurSupporters, label: "Кількість сеньйорів пластунів прихильників" },
    { value: StatisticsItemIndicator.NumberOfSeigneurMembers, label: "Кількість сеньйорів пластунів учасників" }
  ];

  const { TreeNode } = TreeSelect;
  const { Title } = Typography;

  useEffect(() => {
    fetchRegions();
    fechYears();
  }, []);

  const fetchRegions = async () => {
    try {
      let response = await RegionsApi.getRegions();
      let regions = response.data as Region[];
      setRegions(regions.map(item => {
        return {
          label: item.regionName,
          value: item.id
        }
      }));
    }
    catch (error) {
      showError(error.message);
    }
  };

  const fechYears = async () => {
    try {
      const arrayOfYears = [];
      var endDate = Number(new Date().getFullYear());
      for (let i = 2000; i <= endDate; i++) {
        arrayOfYears.push({ lable: i.toString(), value: i });
      }
      setYears(arrayOfYears);
    }
    catch (error) {
      showError(error.message);
    }
  }

  const showError = (message: string) => {
    Modal.error({
      title: "Помилка!",
      content: message,
    });
  };

  const onSubmit = async (info: any) => {
    let counter = 1;

    let response = await StatisticsApi.getRegionsStatistics({
      RegionIds: info.regionIds,
      Years: info.years,
      Indicators: info.indicators
    });

    // seting (for chart needs) statisticsItems indicators of the very first element 
    // because they are the same for all the elements
    setArrayOfIndicators(response.data[0].yearStatistics[0].statisticsItems.map((it: any)=> it.indicator));
    
    // reading data from response and seting data for table
    let data = response.data.map((region: RegionStatistics) => {
      return region.yearStatistics.map(yearStatistic => {
        return {
          id: counter++,
          regionName: region.region.regionName,
          year: yearStatistic.year,
          ...yearStatistic.statisticsItems.map(it => it.value)
        }
      })
    }).flat();

    // reading statisticsItems' indicators of the very first element 
    // because they are the same for all the items
    let statistics = (response.data && response.data[0] && response.data[0].yearStatistics
      && response.data[0].yearStatistics[0] && response.data[0].yearStatistics[0].statisticsItems) || [];

    setShowTable(true);
    setResult(data);
    setOnClickRow(null);

    // creating and seting columns for table
    let temp = [...constColumns, ...statistics.map((statisticsItem: any, index: any) => {
      return {
        title: indicatorsArray[statisticsItem.indicator as number].label,
        dataIndex: index,
        key: index,
        width: 130
      }
    })];

    setColumns(temp);
  };
  
  // calculating for chart percentage
  let sumOfIndicators = 0;
  dataChart.map((indicator: any) => { sumOfIndicators += indicator.count });

  let onChange = (pagination: any) => {
    if (pagination) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
  }

  if(dataFromRow != undefined)
{
  const regex = /[0-9]/g;

  // seting data for chart
  const allDataForChart = [...Object.entries(dataFromRow as Object).map(([key, value]) => {
    if(key.match(regex)!== null)
    {
    return{
      item: indicatorsArray[arrayOfInindicators[Number(key)]].label,
      count: value,
      percent: value    
    }}
  })]
  let indicatorsForChart = allDataForChart.slice(0, columns.length - 3);
  setTitle(dataFromRow);
  setDataChart(indicatorsForChart);
  setDataFromRow(undefined);
}

  const onClick = (value: Array<Number>) => {
  
    if (value.includes(2)) {
      setSelectableUnatstvaPart(false);
    }
    if(!value.includes(2)){
      setSelectableUnatstvaPart(true);
    }
    if (value.includes(3)||value.includes(4)||value.includes(5)||value.includes(6)||value.includes(7)) {
      setSelectableUnatstvaZahalom(false);
    }
    if (!value.includes(3)&&!value.includes(4)&&!value.includes(5)&&!value.includes(6)&&!value.includes(7)) {
      setSelectableUnatstvaZahalom(true);
    }
    
    if (value.includes(8)) {
      setSelectableSeniorPart(false);
    }
    if (!value.includes(8)) {
      setSelectableSeniorPart(true);
    }
    if (value.includes(9)||value.includes(10)) {
      setSelectableSeniorZahalom(false);
    }
    if (!value.includes(9)&&!value.includes(10)) {
      setSelectableSeniorZahalom(true);
    }
  
    if (value.includes(11)) {
      setSelectableSeigneurPart(false);
    }
    if (!value.includes(11)) {
      setSelectableSeigneurPart(true);
    }
    if (value.includes(12)||value.includes(13)) {
      setSelectableSeigneurZahalom(false);
    }
    if (!value.includes(12)&&!value.includes(13)) {
      setSelectableSeigneurZahalom(true);
    }
  
    if (value.length == 0) {
      setSelectableUnatstvaPart(true);
      setSelectableUnatstvaZahalom(true);
      setSelectableSeniorPart(true);
      setSelectableSeniorZahalom(true);
      setSelectableSeigneurPart(true);
      setSelectableSeigneurZahalom(true);
    }
  }

  return (
    <Layout.Content>
      <div className = "background">
        <Title level={2}>Статистика округ</Title>
        <div className = "formGlobal">
          <div className = "form">
            <Form onFinish={onSubmit}>
              <Row justify="center">
                <Col span={20}>
                  <Form.Item
                    labelCol={{span: 24}}
                    label="Округи"
                    name="regionIds"
                    rules={[{required: true, message: shouldContain("хоча б одну округу"), type: "array"}]} >
                    <Select
                      maxTagCount={4}
                      showSearch
                      allowClear
                      mode="multiple"
                      options={regions}
                      placeholder="Обрати округу"
                      filterOption={(input, option) => (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={20}>
                  <Form.Item
                    labelCol={{span: 24}}
                    label="Роки"
                    name="years"
                    rules={[{required: true, message: shouldContain("хоча б один рік"), type: "array"}]}>
                    <Select
                      maxTagCount={8}
                      showSearch
                      allowClear
                      mode="multiple"
                      options={years}
                      placeholder="Обрати рік"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center">
                <Col span={20}>
                  <Form.Item
                    labelCol={{span: 24}}
                    label="Показники"
                    name="indicators"
                    rules={[{required: true, message: shouldContain("хоча б один показник"), type: "array"}]}>
                    <TreeSelect
                      maxTagCount={4}
                      showSearch
                      allowClear
                      multiple
                      onChange={onClick}
                      treeDefaultExpandAll
                      placeholder="Обрати показник"
                      filterTreeNode={(input, option) => (option?.title as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        <TreeNode value={0} title="Кількість пташат"/>
                        <TreeNode value={1} title="Кількість новацтва"/>
                        <TreeNode value={2} title="Кількість юнацтва загалом" selectable = {selectableUnatstvaZahalom}>
                          <TreeNode value={3} title="Кількість неіменованих" selectable = {selectableUnatstvaPart}/>
                          <TreeNode value={4} title="Кількість прихильників" selectable = {selectableUnatstvaPart}/>
                          <TreeNode value={5} title="Кількість учасників" selectable = {selectableUnatstvaPart}/>
                          <TreeNode value={6} title="Кількість розвідувачів" selectable = {selectableUnatstvaPart}/>
                          <TreeNode value={7} title="Кількість скобів/вірлиць" selectable = {selectableUnatstvaPart}/>
                        </TreeNode>
                        <TreeNode value={8} title="Кількість старших пластунів загалом" selectable = {selectableSeniorZahalom}>
                          <TreeNode value={9} title="Кількість старших пластунів прихильників" selectable = {selectableSeniorPart}/>
                          <TreeNode value={10} title="Кількість старших пластунів учасників" selectable = {selectableSeniorPart}/>
                        </TreeNode>
                        <TreeNode value={11} title="Кількість сеньйорів загалом" selectable = {selectableSeigneurZahalom}>
                          <TreeNode value={12} title="Кількість сеньйорів пластунів прихильників" selectable = {selectableSeigneurPart}/>
                          <TreeNode value={13} title="Кількість сеньйорів пластунів учасників" selectable = {selectableSeigneurPart}/>
                        </TreeNode>
                    </TreeSelect>
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit">
                      Сформувати
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          <br/>
          {sumOfIndicators === 0 || title === undefined || onClickRow === null ? '':
            <div className = "chart">
              <h1>{title.regionName}, {title.year}</h1>
              <Chart height={400} data={dataChart} justify="center" autoFit>
                <Coordinate type="theta" radius={0.75}/>
                <Tooltip showTitle={false}/>
                <Axis visible={false}/>
                <Interval
                  position="percent"
                  adjust="stack"
                  color="item"
                  style={{
                    lineWidth: 1,
                    stroke: "#fff",
                  }}
                  label={["count", {
                    content: (data) => {
                      return `${data.item}: ${Math.round(data.percent / sumOfIndicators * 100)}%`;
                    },
                  }]}
                />
                <Interaction type="element-single-selected"/>
              </Chart>
            </div>
          }
        </div>
        {showTable === false ? "" :
            <Table
              bordered
              rowClassName={(record, index) => index === onClickRow ? "onClickRow" : "" }
              rowKey="id"
              columns={columns}
              dataSource={result}
              scroll={{ x: 1000 }}
              onRow={(regionRecord, index) => {
                return {              
                  onClick: async () => {              
                    setDataFromRow(regionRecord);
                    setOnClickRow(index);
                  },
                  onDoubleClick: async () => {                
                    setOnClickRow(null);
                  }
                };
              }}
              onChange={onChange}
              pagination={{
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
              }}
            />
          }
      </div>
    </Layout.Content>
  )
}

export default StatisticsCities;