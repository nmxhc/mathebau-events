import { Table, Header, HeaderRow, HeaderCell, Body, Row, Cell } from '@table-library/react-table-library';
import moment from 'moment';
import type { FC } from 'react';
import { useTheme } from '@table-library/react-table-library/theme';
import type { getEventWithAdminDetails } from '~/models/event.server';
import type { ArrayElement } from '~/utils';
import { downloadAsCsv} from '~/utils/csv-export'

type Event = NonNullable<Awaited<ReturnType<typeof getEventWithAdminDetails>>>

export function getNodes(event: Event) {
  return event.signups.map(s => {
    const node :Record<string, string|Date|boolean> & {id: string} = {
      id: s.id,
      name: s.participant.name,
      email: s.participant.email,
      signupTime: s.signupTime,
      validatedEmail: s.participant.validatedEmail
    }
    for (const sEIV of s.signupEventInputValues) {
      node[sEIV.eventInputField.inputField.name] = sEIV.value;
    }
    return node
  })
}

export type Nodes = ReturnType<typeof getNodes>

export const handleDownloadCsv = (event: Event) => {
  const columns = [
    { accessor: (item: ArrayElement<Nodes>) => item.name, name: 'Name' },
    { accessor: (item: ArrayElement<Nodes>) => item.email, name: 'Email' },
    { accessor: (item: ArrayElement<Nodes>) => item.signupTime, name: 'Anmeldezeit' },
    { accessor: (item: ArrayElement<Nodes>) => item.validatedEmail, name: 'Email bestätigt' },
    ...event.eventInputFields.map(eIF => ({
      accessor: (item: ArrayElement<Nodes>) => item[eIF.inputField.name],
      name: eIF.inputField.name
    }))
  ];

  downloadAsCsv(columns, getNodes(event), `Anmeldungen ${event.name} - Stand ${moment().format('YYYY-MM-DD HH_mm')}`);
};

export const EventSignupTable:FC<{event: Event}> = ({event}) => {
  
  const nodes = getNodes(event)

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 100px 33% 33% ${new Array(event.eventInputFields.length + 1).join(' 33%')} minmax(150px, 1fr);
    `,
    BaseCell: `
      &:nth-of-type(1) {
        left: 0px;
        z-index: 1;
      }
    `
  });

  const data = {nodes};

  return (
    <Table data={data} theme={theme} layout={{custom: true, horizontalScroll: true }} className='p-2 rounded-md mt-2 bg-stone-700'>
      {(tableList) => (
        <>
          <Header>
            <HeaderRow className='bg-stone-700'>
              <HeaderCell className=' z-50'>Name</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Anmeldezeit</HeaderCell>
              <HeaderCell>Email bestätigt</HeaderCell>
              {event.eventInputFields.map(eIF => (
                <HeaderCell key={eIF.id}>{eIF.inputField.name}</HeaderCell>
              ))}
            </HeaderRow>
          </Header>

          <Body>
            {tableList.map((item) => (
              <Row key={item.id} item={item} className='bg-stone-700'>
                <Cell pinLeft>{item.name}</Cell>
                <Cell>{item.email}</Cell>
                <Cell>
                  {moment(item.signupTime).format('DD.MM.YY HH:mm')}
                </Cell>
                <Cell>
                  <input
                    type='checkbox'
                    checked={item.validatedEmail}
                    disabled />
                </Cell>
                {event.eventInputFields.map(eIF => (
                  <Cell key={eIF.id}>{item[eIF.inputField.name]}</Cell>
                ))}
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
  );
};