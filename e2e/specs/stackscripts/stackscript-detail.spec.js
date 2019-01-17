const { constants } = require('../../constants');
const { readToken } = require('../../utils/config-utils');
import {
    apiDeleteMyStackScripts,
    timestamp,
    switchTab,
    managerTab,
} from '../../utils/common';
import ConfigureStackScripts from '../../pageobjects/configure-stackscript.page';
import ListStackScripts from '../../pageobjects/list-stackscripts.page';
import StackScriptDetail from '../../pageobjects/stackscripts/stackscript-detail.page';
import ConfigureLinode from '../../pageobjects/configure-linode';

describe('StackScript - detail page and drawer suite', () => {

  let selectedStackScript;

  const getStackScriptDetailsFromRow = () => {
      browser.pause(500);
      browser.waitUntil(() => {
          return ListStackScripts.stackScriptRows.length > 0;
      }, constants.wait.normal);
      const titleAndAuthor = $$(`${ListStackScripts.stackScriptTitle.selector} h3`)[0].getText();
      const deploys = $$(ListStackScripts.stackScriptDeploys.selector)[0].getText();
      const compatibleDisrobutions = $$(ListStackScripts.stackScriptCompatibleDistrobutions.selector)[0].$$('div').map( distro => distro.getText());
      const getTitleAndAuthor = titleAndAuthor.split('/');
      const stackScriptDetails = {
          title: getTitleAndAuthor[1].trim(),
          author: getTitleAndAuthor[0].trim(),
          deploys: deploys,
          distrobutions: compatibleDisrobutions
      }
      return stackScriptDetails;
  }

  const verifyStackScriptDetailPageOrDrawer = (title,author,deployments,distrobutions,description,code) => {
      expect(StackScriptDetail.stackScriptTitle(title).isDisplayed()).toBe(true);
      expect(StackScriptDetail.stackScriptAuthor(author).isDisplayed()).toBe(true);
      expect(StackScriptDetail.stackScriptDeployments.getText()).toContain(deployments);
      const displayedDistrobutionLabels = StackScriptDetail.getStackScriptCompatibleDisrobutions();
      const token = readToken(browser.options.testUser);
      distrobutions.forEach((distro) => {
          browser.getLinodeImage(token,distro.trim()).then((image) => {
              expect(displayedDistrobutionLabels.includes(image.label)).toBe(true);
          });
      })
      if(description){
          expect(StackScriptDetail.stackScriptDescription.getText()).toContain(description);
      }
      if(code){
          const scriptList = code.split('\n');
          expect(StackScriptDetail.getStackScriptCode()).toEqual(scriptList);
      }
  }

  beforeAll(() => {
      browser.url(constants.routes.stackscripts);
      ListStackScripts.baseElementsDisplay();
  });

  afterAll(() => {
      apiDeleteMyStackScripts();
  });

  describe('Community StackScript detail page', () => {

      beforeAll(() => {
          ListStackScripts.changeTab('Community StackScripts');
      });

      it('StackScript detail page displays', () => {
          selectedStackScript = getStackScriptDetailsFromRow();
          ListStackScripts.stackScriptDetailPage();
          StackScriptDetail.stackScriptDetailPageDisplays();
      });

      it('Verify StackScript details correspond to the row clicked', () => {
          verifyStackScriptDetailPageOrDrawer(selectedStackScript.title,selectedStackScript.author,selectedStackScript.deploys,selectedStackScript.distrobutions);
      });

      it('Breadcrumb link navigates back to StackScript landing', () => {
          expect(StackScriptDetail.breadcrumbStaticText.getText()).toEqual(`${selectedStackScript.author} / ${selectedStackScript.title}`);
          StackScriptDetail.breadcrumbBackLink.click();
          ListStackScripts.baseElementsDisplay();
      });
  });

  describe('Created StackScript - detail page and detail drawer', () => {

    const stackConfig = {
        label: `AutoStackScript${timestamp()}`,
        description: 'test stackscript example',
        images: ['debian9', 'arch', 'containerlinux'],
        script: '#!/bin/bash\necho "Hello Linode"',
    }

    beforeAll(() => {
        ListStackScripts.create.click();
        ConfigureStackScripts.baseElementsDisplay();
        ConfigureStackScripts.configure(stackConfig);
    });

    it('StackScript detail page displays for created StackScript', () => {
        ConfigureStackScripts.create(stackConfig);
        ListStackScripts.stackScriptRowByTitle(stackConfig.label).waitForDisplayed(constants.wait.true);
        ListStackScripts.stackScriptDetailPage(stackConfig.label);
        StackScriptDetail.stackScriptDetailPageDisplays();
    });

    it('Verify StackScript detail page displays the correct data for created StackScript', () => {
        verifyStackScriptDetailPageOrDrawer(stackConfig.label,browser.options.testUser,'0',stackConfig.images,stackConfig.description,stackConfig.script);
        expect(StackScriptDetail.breadcrumbStaticText.getText()).toEqual(`${browser.options.testUser} / ${stackConfig.label}`);
    });

    it('Author text links to the community StackScripts page', () => {
        StackScriptDetail.stackScriptAuthor(browser.options.testUser).$('a').click();
        switchTab();
        expect(browser.getTitle()).toContain('StackScripts -');
        expect(browser.getUrl()).toContain(`linode.com/stackscripts/profile/${browser.options.testUser}`);
        managerTab();
        StackScriptDetail.stackScriptDetailPageDisplays();
    });

    it('Deploy to StackScript button navigates to cofigure Linode from StackScript page', () => {
        StackScriptDetail.deployStackScriptButton.click();
        ConfigureLinode.stackScriptTableDisplay();
        ConfigureLinode.stackScriptRowByTitle(stackConfig.label).waitForDisplayed(constants.wait.normal);
        expect(ConfigureLinode.stackScriptRowByTitle(stackConfig.label).getAttribute('data-qa-radio')).toBe('true');
    });

    it('StackScript detail drawer opens from the StackScri[pt] table on the configure Linode page', () => {
        ConfigureLinode.stackScripShowDetails(stackConfig.label);
        StackScriptDetail.stackScriptDetailDrawerDisplays();
    });

    it('StackScript detail drawer displays correct StackScript details ', () => {
        verifyStackScriptDetailPageOrDrawer(stackConfig.label,browser.options.testUser,'0',stackConfig.images,stackConfig.description,stackConfig.script);
        expect(StackScriptDetail.drawerTitle.getText()).toEqual(`${browser.options.testUser} / ${stackConfig.label}`);
        StackScriptDetail.drawerClose.click();
        ConfigureLinode.drawerBase.waitForDisplayed(constants.wait.normal, true);
    });

  });

  describe('Community StackScript detail drawer', () => {

      beforeAll(() => {
          ConfigureLinode.changeTab('Community StackScripts');
      });

      it('StackScript detail drawer displays', () => {
          selectedStackScript = getStackScriptDetailsFromRow();
          ConfigureLinode.stackScripShowDetails();
          StackScriptDetail.stackScriptDetailDrawerDisplays();
      });

      it('Verify StackScript drawer details correspond to the row clicked', () => {
          verifyStackScriptDetailPageOrDrawer(selectedStackScript.title,selectedStackScript.author,selectedStackScript.deploys,selectedStackScript.distrobutions);
          expect(StackScriptDetail.drawerTitle.getText()).toEqual(`${selectedStackScript.author} / ${selectedStackScript.title}`);
          StackScriptDetail.drawerClose.click();
          ConfigureLinode.drawerBase.waitForDisplayed(constants.wait.normal, true);
      });

  });

});
