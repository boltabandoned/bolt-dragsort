<?php

namespace SahAssar\DragSort;

use Silex\Application;
use Bolt\Extension\SimpleExtension;
use Bolt\Controller\Zone;
use Bolt\Asset\Target;
use Bolt\Asset\File\JavaScript;
use Bolt\Asset\File\Stylesheet;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DragSortExtension extends SimpleExtension
{

    /**
     * {@inheritdoc}
     */
    protected function registerBackendRoutes(ControllerCollection $collection)
    {
        $collection->post('/dragsort', [$this, 'setSortOrder'])->before([$this, 'before']);
    }

    /**
     * {@inheritdoc}
     */
    protected function registerTwigPaths()
    {
        return [
            'templates' => ['position' => 'prepend', 'namespace' => 'bolt']
        ];
    }

    /**
     * {@inheritdoc}
     */
    protected function registerAssets()
    {
        $dragulajs = (new JavaScript('dragula.min.js'))
                ->setZone(Zone::BACKEND);
        $dragulacss = (new Stylesheet('dragula.min.css'))
                ->setZone(Zone::BACKEND);
        $dragsort = (new JavaScript('dragsort.js'))
                ->setZone(Zone::BACKEND)
                ->setLocation(Target::AFTER_JS);
        return [
            $dragsort,
            $dragulajs,
            $dragulacss,
        ];
    }

    /**
     * @param Request $request
     * @param Application $app
     * @return null|RedirectResponse
     */
    public function before(Request $request, Application $app)
    {
        $ct = $request->get('contenttype');
        if (!$app['users']->isAllowed("contenttype:$ct:edit")) {
            /** @var UrlGeneratorInterface $generator */
            $generator = $app['url_generator'];
            return new RedirectResponse($generator->generate('dashboard'), Response::HTTP_SEE_OTHER);
        }
        return null;
    }

    /**
     * @param Request $request
     * @param Application $app
     * @return string
     */
    public function setSortOrder(Request $request, Application $app)
    {
        $sorting = json_decode($request->get('sorting'));
        $ct = $request->get('contenttype');
        $repo = $app['storage']->getRepository($ct);
        foreach ($sorting as $key => $value) {
            $record = $repo->find(str_replace('item_', '', $key));
            $record->set('sortorder', $value);
            $repo->save($record);
        }
        return '';
    }
}
