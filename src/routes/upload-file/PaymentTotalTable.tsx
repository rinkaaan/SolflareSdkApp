import {Header, SpaceBetween, Table} from "@cloudscape-design/components"
import "./style.css"

export default function PaymentTotalTable() {
  return (
      <SpaceBetween size="xxs" direction="vertical">
        <Header variant="h3">Order summary</Header>
        <Table
            renderAriaLive={({
                               firstIndex,
                               lastIndex,
                               totalItemsCount
                             }) =>
                `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
            }
            columnDefinitions={[
              {
                id: "item",
                header: "Item",
                cell: item => item.item,
                width: "300px"
              },
              {
                id: "price",
                header: "Price",
                cell: item => item.price,
              }
            ]}
            enableKeyboardNavigation
            items={[
              {
                item: "Usage fee for 1 month",
                price: "$0.01",
              },
            ]}
            loadingText="Loading resources"
            sortingDisabled
            variant="embedded"
        />
      </SpaceBetween>
  )
}
