function createEmbedAccountTable(sheet, range) {
    const data = sheet.getRange(range).getValues();
  
    const embedTable = {
      type: "rich",
      fields: []
    };
  
    for (let col = 0; col < data[0].length; col++) {
      const colValues = data.map(row => row[col]);
      const colName = colValues.shift();
  
      const colField = {
        name: colName,
        value: colValues.map(val => {
          const parsedVal = parseFloat(val);
          if (isNaN(parsedVal)) {
            return val;
          } else {
            const formattedVal = parsedVal.toFixed(2);
            return `${formattedVal} €`;
          }
        }).join('\n'),
        inline: true
      };
  
      embedTable.fields.push(colField);
    }
  
    return embedTable;
  }

function postTextToDiscord (text) {
    const dicordUrl = 'https://discordapp.com/api/webhooks/1078320144746565772/M-vg9Im5BHpTgyzFc19nLhzbMmj9NajWbCfTxyzsE5fKlVazlrbWmoec2xceQ6-Sx6Nf';


    const message = {
            content: 'text'
    }

    const options = {
        'method': 'post',
        'payload': message
    }

    const res = UrlFetchApp.fetch(dicordUrl, options);
}
  
  function postEmbedTableToDiscord(embedTable) {
    const discordUrl = 'https://discordapp.com/api/webhooks/1078320144746565772/M-vg9Im5BHpTgyzFc19nLhzbMmj9NajWbCfTxyzsE5fKlVazlrbWmoec2xceQ6-Sx6Nf';
  
    const message = {
      embeds: [embedTable]
    };
  
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(message)
    };
  
    UrlFetchApp.fetch(discordUrl, options);
}