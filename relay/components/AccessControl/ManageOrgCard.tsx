import Link from 'next/link';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import useOrgAdmin from '../../hooks/useOrgAdmin';

interface OrgAccessCardListItemProps {
  address: string
}

function OrgAccessCardListItem(props: OrgAccessCardListItemProps): JSX.Element {
  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <AddressIdenticon address={props.address} height={8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {props.address}
          </p>
        </div>
      </div>
    </li>
  );
}

interface ManageAccessCardProps {
  orgName: string,
  orgAdmins: string[]
}

export default function ManageAccessCard(props: ManageAccessCardProps): JSX.Element {
  const isOrgAdmin = useOrgAdmin(props.orgName);
  return (
    <section aria-labelledby="recent-hires-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="p-6">
          <h2 className="text-base font-medium text-gray-900" id="recent-hires-title">Organization Members</h2>
          <div className="flow-root mt-6">
            <ul className="-my-5 divide-y divide-gray-200">
              { props.orgAdmins.map((address) => <OrgAccessCardListItem key={address} address={address} />)}
            </ul>
          </div>
          { isOrgAdmin && <div className="mt-6">
            <Link href={`/v/${props.orgName}/edit`}>
              <a className="w-full flex justify-center items-center px-4 py-2 border
              border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700
              bg-white hover:bg-gray-50">
                Manage Access
              </a>
            </Link>
          </div> }
        </div>
      </div>
    </section>
  );
}
