import semver from 'semver';

export default {
   patchId: '15ae3194c13e9c15d5f231a36620bf33',
   shouldRun: (currentVersion) => semver.lte(currentVersion, '0.0.1'),
   async run() {
      console.log('Migrate db');
      console.log('Db migrated!');
   }
}

