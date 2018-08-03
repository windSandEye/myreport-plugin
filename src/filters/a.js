<Col span="12" style="{'paddingRight':'15px','paddingLeft':'15px'}">
  <h3 style="{'color':'#A9A9B7','fontWeight':'500'}">
    非T4支付能力整体升级
  </h3>
  <div style="{'paddingLeft':'20px'}">
    <FrameAsync source="{
    url: '/myreports/getData.json',
    data: {
        blockUri: 'blockUri1530758316314',
        __dsType: 'common',
        beginDate: '{{report_date | DFormat('YYYYMMDD')}}',
    },
}" filters="{{ response  | canvasTreeFilter }}" initial="{ data: []}">
      <PayAbilityCrowdTree fit="true" treeId="payAbilityCrowdTreeT4"/>
    </FrameAsync>
  </div>
</Col>