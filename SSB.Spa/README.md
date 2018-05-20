# Fuse2

Material Design Admin Template with Angular 6+ and Angular Material 2

## The Community

Share your ideas, discuss Fuse and help each other.

[Click here](http://fusetheme.com/community) to see our Community page.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).




# master dalını aktif hale getirin
git checkout master 
# Dalı silin
git branch -d <dalınızın adı>
git branch shows the branches being worked on locally.
git pull
git push
# Deponuzun durumunu inceleyin

git status
# "feature_x" adıyla yeni bir dal oluşturup o dala geçmek için
git checkout -b feature_x

#master'a geri geçmek için
git checkout master


#oluşturduğumuz dalı silmek için
git branch -d feature_x

bir dalı uzak deponuza göndermedikçe
başkaları tarafından kullanılabilir olmaz
#git push origin <dal>



# create a new branch to store any new changes
git branch soru-deposu lokal dal yarattı
git checkout my-branch lokal dalı aktive etti
git branch aktif olan branch yeşil

# take a snapshot of the staging area (anything that's been added)
git commit -m "my snapshot"


git push --set-upstream origin soru-deposu 


https://guides.github.com/introduction/git-handbook/ 


npm install --save @ncstate/sat-popover @angular/cdk
