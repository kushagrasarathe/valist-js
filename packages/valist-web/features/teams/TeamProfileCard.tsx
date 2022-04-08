/* eslint-disable @next/next/no-img-element */
import Tabs, { Tab } from '../../components/Tabs';
import { TeamMeta } from '../../utils/Valist/types';
import AddressIdenticon from '../../components/Identicons/AddressIdenticon';
import TeamProfileCardActions from './TeamProfileCardActions';

interface TeamProfileCardProps {
  view: string,
  tabs: Tab[],
  setView: Function,
  teamName: string,
  teamImage: string,
  meta: TeamMeta,
}

export default function TeamProfileCard(props: TeamProfileCardProps): JSX.Element {
  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white pt-6 px-6 overflow-hidden shadow">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              {props.teamImage ? 
                <div className="flex-shrink-0 mx-auto rounded-full overflow-hidden" style={{ height: 85, width: 85 }} >
                  <img src={props.teamImage} alt="profile-image" />
                </div>
                :
                <div className="px-6">
                  <AddressIdenticon address={props.teamName} height={80} width={80} />
                </div>
              }
            </div>
            <div>
              <p className={`lg:text-3xl text-gray-900 sm:text-2xl font-medium`}>
                {props.teamName}
              </p>
              <p>
                {props.meta.description}
              </p>
            </div> 
          </div>
        </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={props.tabs}
        />
      </div>
    </section>
  );
}
