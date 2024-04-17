import {
  BlockStack,
  reactExtension,
  Text,
  useApi,
  Link,
  Heading,
  useCheckoutToken,
  Spinner,
  useSelectedPaymentOptions
} from '@shopify/ui-extensions-react/checkout';
import { Grid, View } from '@shopify/ui-extensions/checkout';
import React, { useState } from 'react';

// 1. Choose an extension target
export default reactExtension(
  'purchase.thank-you.block.render',
  () => <Extension />,
);
function Extension() {
  const { cost, shop, selectedPaymentOptions } = useApi();
  var options = useSelectedPaymentOptions();

  if (
    options.some(
      (option) => option.type === undefined,
    )
  ) {
    const [order_id, setorder_id] = useState('');
    const [method, setmethod] = useState(1);
    const useCheckoutToken2 = useCheckoutToken();
    const extractShopId = (shop) => {
      const idRegex = /gid:\/\/shopify\/Shop\/(\d+)/;
      const match = idRegex.exec(shop.id);
      return match ? match[1] : null;
    };
    var shopId = extractShopId(shop);
    async function API() {
      try {
        const requestOptions = {
          method: "GET",
        };
        const response = await fetch("https://shopify-app.fena.co/public/order_details?shop=" + shop.myshopifyDomain + "&cart_id=" + useCheckoutToken2, requestOptions)
        if (response.ok) {
          const data = await response.json();
          console.log(data, 'data')
          var url_redirect = 'https://shopify.com/' + shopId + '/account/orders/' + data?.orders[0]?.id;
          var url = 'https://shopify-app.fena.co/public/fena-checkout?site=dev&redirect=' + url_redirect + '&host=' + shop.myshopifyDomain + '&orederRef=' + data?.orders[0]?.id;
          setorder_id(url)
          if (data?.orders[0]?.payment_gateway_names[0] != 'Pay By Bank') {
            setmethod(0)
          }
        }
      } catch (error) {
        console.log('order', error);
      }
    }
    setTimeout(() => {
      API()
    }, 3000);
    if (method == 1) {
      return (

        <>
          <View ><Text size="extraLarge" >Complete Payment by clicking link below</Text></View>
          <Grid columns={['26%', 'fill', 'auto']} spacing="loose">
            <View >
              <Link to={order_id} external="false">Complete Your Payment</Link>
            </View>
            <View>
              {order_id ? '' : <Spinner />}
            </View>
          </Grid>
        </>

      );
    }
  }
  else {
    return null;
  }
}
