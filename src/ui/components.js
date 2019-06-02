// Reference: https://github.com/zeit/integrations/blob/master/easycron/src/components/Table.ts

const { htm } = require('@zeit/integration-utils')

exports.Table = (header, children) => {
  return htm`
    <Box
      width="100%"
      display="table"
      borderRadius="5px"
      borderColor="#eaeaea"
      overflow="hidden"
      borderStyle="solid"
      borderWidth="1px"
      marginTop="20px"
      marginBottom="20px"
    >
      <Box display="table-header-group" backgroundColor="rgb(250, 250, 250)">
        <Box display="table-row">
          ${header}
        </Box>
      </Box>
      <Box display="table-row-group">
        ${children}
      </Box>
    </Box>
  `
}

exports.TableRow = (children = null) => {
  return htm`
    <Box
      display="table-row"
      borderColor="#eaeaea"
      borderStyle="solid"
      borderBottomWidth="1px"
      backgroundColor="white"
    >
      ${children}
    </Box>
  `
}

exports.HeaderItem = (children = null) => {
  return htm`
    <Box
      display="table-cell"
      padding="10px"
      borderColor="#eaeaea"
      borderStyle="solid"
      borderWidth="0px"
      borderBottomWidth="1px"
      ><P><B>${children}</B></P></Box
    >
  `
}

exports.BodyItem = (children = null) => {
  return htm`
    <Box display="table-cell" padding="10px"><P>${children}</P></Box>
  `
}
