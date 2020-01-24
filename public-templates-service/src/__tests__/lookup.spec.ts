// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { equal, strictEqual } from "assert";
import { generate } from "../generateFiles";

test('generate known', () => {

    let templates = [{
        file: '../templates/finos.org/Bond.json',
        properties:
            ['type',
                'version',
                'id',
                'side',
                'info',
                'tradeDate',
                'settlementDate',
                'faceValue',
                'instrument']
    },
    {
        file: '../templates/iextrading.com/Quote.json',
        properties:
            ['symbol',
                'companyName',
                'primaryExchange',
                'sector',
                'calculationPrice',
                'open',
                'openTime',
                'close',
                'closeTime',
                'high',
                'low',
                'latestPrice',
                'latestSource',
                'latestTime',
                'latestUpdate',
                'latestVolume',
                'iexRealtimePrice',
                'iexRealtimeSize',
                'iexLastUpdated',
                'delayedPrice',
                'delayedPriceTime',
                'extendedPrice',
                'extendedChange',
                'extendedChangePercent',
                'extendedPriceTime',
                'previousClose',
                'change',
                'changePercent',
                'iexMarketPercent',
                'iexVolume',
                'avgTotalVolume',
                'iexBidPrice',
                'iexBidSize',
                'iexAskPrice',
                'iexAskSize',
                'marketCap',
                'peRatio',
                'week52High',
                'week52Low',
                'ytdChange']
    },
    {
        file: '../templates/schema.org/FlightUpdate.json',
        properties:
            ['@context',
                '@type',
                'reservationId',
                'reservationStatus',
                'passengerPriorityStatus',
                'passengerSequenceNumber',
                'securityScreening',
                'underName',
                'reservationFor']
    },
    {
        file: '../templates/schema.org/Thing.json',
        properties:
            ['@context',
                '@type',
                'name',
                'url',
                'image',
              ]
    },
    {
        file: '../templates/schema.org/Restaurant.json',
        properties:
            ['@context',
                '@type',
                'name',
                'url',
                'address',
                'image',
                'telephone',
                'aggregateRating',
                'review',
                'priceRange']
    }
   ];

    let testData = {
        "name": "Matt",
        "url": "...",
        "image": "..."
    };

    //Utils.
    //strictEqual(final.length, 2);
    //strictEqual(final[0].propMatchCount, 3);
})

test("Generate properties from sample data", () => {
    generate();
})
