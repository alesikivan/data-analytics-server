import config from 'config'
import { Client } from "@hubspot/api-client"

export const isUserEmailExist = email => {
  return new Promise(async resolve => {
    const hubspotClient = new Client({ accessToken: config.get('APP.HUBSPOT_API_KEY') })

    const filter = {
      propertyName: 'email',
      operator: 'EQ',
      value: email
    }
  
    const filterGroup = { filters: [filter] }
    const properties = ['email', 'firstname', 'lastname']
    const query = { filterGroups: [filterGroup], properties }

    const response = await hubspotClient.crm.contacts.searchApi.doSearch(query)
    const contacts = response.results

    resolve(contacts && contacts.length > 0)
  })
}